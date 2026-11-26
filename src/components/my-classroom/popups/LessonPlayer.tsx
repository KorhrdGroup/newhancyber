"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { recordProgressAction } from "@/app/popup/lesson/actions";
import { Badge, ProgressBar } from "../ClassroomUI";

export type Chapter = { at: number; title: string; level: number };
export type Cue = { at: number; text: string };

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
/** 보낼 주기 (초) — 서버는 한 번에 90초까지만 받는다 */
const SEND_EVERY = 15;

/**
 * 강의 영상 학습창 (DB) — 서명된 영상 주소로 재생하고, 「실제로 재생된 시간」을 15초마다 · 멈출 때 서버에 보낸다.
 * 재생 시간은 화면에 보이는 동안 영상이 재생 중일 때의 실제 경과 시간이다 — 건너뛰기는 세지 않고, 2배속이면 절반만 센다.
 * 다시 열면 마지막 위치에서 이어 본다. 목차(CDMS 강의시간)를 누르면 그 위치로, 자막은 지금 줄을 보여 준다.
 * canRecord 가 아니면(복습 · 열리기 전) 보기만 하고 보내지 않는다.
 */
export default function LessonPlayer({
  src,
  classId,
  pageId,
  playSeconds,
  startAt,
  initialWatched,
  initialCompleted,
  canRecord,
  chapters,
  cues,
}: {
  src: string | null;
  classId: number;
  pageId: number;
  playSeconds: number;
  startAt: number;
  initialWatched: number;
  initialCompleted: boolean;
  canRecord: boolean;
  chapters: Chapter[];
  cues: Cue[];
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [now, setNow] = useState(0);
  const [watched, setWatched] = useState(initialWatched);
  const [completed, setCompleted] = useState(initialCompleted);
  const [broken, setBroken] = useState(false);
  const [saveError, setSaveError] = useState(false);
  /** 아직 보내지 않은 재생 시간(초) · 재생 중이면 마지막으로 잰 시각 */
  const pending = useRef(0);
  const lastTick = useRef<number | null>(null);
  const sending = useRef(false);

  /** 재생 중인 동안의 실제 경과 시간을 pending 에 더한다 */
  const tick = useCallback(() => {
    const v = video.current;
    const t = performance.now();
    if (lastTick.current !== null && v && !v.paused && !v.seeking && document.visibilityState === "visible") {
      pending.current += Math.min(5, (t - lastTick.current) / 1000); // 잠깐 멈춤 · 절전에서 돌아온 큰 틈은 5초까지만
    }
    lastTick.current = v && !v.paused ? t : null;
  }, []);

  const flush = useCallback(async () => {
    tick();
    if (!canRecord || sending.current) return;
    const delta = Math.floor(pending.current);
    if (delta < 1) return;
    sending.current = true;
    pending.current -= delta;
    const r = await recordProgressAction(classId, pageId, delta, Math.floor(video.current?.currentTime ?? 0));
    sending.current = false;
    if (r.ok) {
      setSaveError(false);
      if (r.watchedSeconds !== undefined) setWatched(r.watchedSeconds);
      if (r.completed) setCompleted(true);
    } else {
      setSaveError(true);
      pending.current += delta; // 다음에 다시
    }
  }, [canRecord, classId, pageId, tick]);

  // 이어 보기 — 끝 근처가 아니면 마지막 위치로
  useEffect(() => {
    const v = video.current;
    if (!v || startAt <= 0 || startAt >= playSeconds - 5) return;
    const go = () => {
      v.currentTime = startAt;
    };
    if (v.readyState >= 1) go();
    else v.addEventListener("loadedmetadata", go, { once: true });
  }, [startAt, playSeconds]);

  // 15초마다 보내기 · 창을 가리거나 닫을 때 보내기
  useEffect(() => {
    if (!canRecord) return;
    const timer = setInterval(() => void flush(), SEND_EVERY * 1000);
    const onHide = () => {
      if (document.visibilityState === "hidden") void flush();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onHide);
      void flush();
    };
  }, [canRecord, flush]);

  const seek = (s: number) => {
    tick();
    if (video.current) {
      video.current.currentTime = s;
      void video.current.play().catch(() => undefined);
    }
    setNow(s);
  };
  const current = cues.reduce((acc, c, i) => (c.at <= now ? i : acc), -1);
  const chapter = chapters.reduce((acc, c, i) => (c.at <= now ? i : acc), -1);
  const need = Math.ceil(playSeconds * 0.8);
  const percent = playSeconds > 0 ? Math.min(100, Math.round((watched / playSeconds) * 100)) : 0;

  return (
    <div className="pp-player">
      <div>
        <div className="pp-video pp-video--live">
          {src && !broken ? (
            <video
              ref={video}
              src={src}
              controls
              preload="metadata"
              controlsList="nodownload"
              style={{ width: "100%", height: "100%", background: "#000" }}
              onPlay={() => {
                lastTick.current = performance.now();
              }}
              onPause={() => void flush()}
              onEnded={() => void flush()}
              onSeeking={tick}
              onTimeUpdate={(e) => {
                tick();
                setNow(Math.floor(e.currentTarget.currentTime));
              }}
              onError={() => setBroken(true)}
            />
          ) : (
            <div>
              <strong>{src ? "영상을 불러오지 못했어요." : "영상을 준비 중이에요."}</strong>
              {src ? "잠시 뒤 다시 열어 주세요. 계속 안 되면 1:1 원격지원(1661-7768)으로 문의해 주세요." : "강의 영상이 연결되면 여기서 재생돼요."}
            </div>
          )}
        </div>
        {cues.length > 0 && <p className="pp-note ds-mt-8">{current >= 0 ? cues[current].text : " "}</p>}
        <div className="pp-box ds-mt-16">
          <div className="pp-row pp-row--between">
            <span className="ds-body-14-semibold">이 차시 학습 시간</span>
            <Badge>{completed ? "완료" : watched > 0 ? "학습 중" : "미학습"}</Badge>
          </div>
          <div className="ds-mt-8">
            <ProgressBar value={percent} />
          </div>
          <p className="pp-note ds-mt-8">
            {fmt(watched)} / {fmt(playSeconds)} · 강의 시간의 80%({fmt(need)}) 이상 들으면 학습 완료(출석)로 인정돼요. 건너뛴 부분과 빨리 듣기는 그만큼 적게
            들어가요.
            {!canRecord && " 지금은 보기만 할 수 있어 학습 시간이 남지 않아요."}
          </p>
          {saveError && (
            <p className="ds-text-danger ds-mt-8" role="alert">
              학습 시간을 저장하지 못했어요. 인터넷 연결을 확인해 주세요 — 다시 연결되면 이어서 저장돼요.
            </p>
          )}
        </div>
      </div>
      {chapters.length > 0 && (
        <nav className="pp-lessons" aria-label="강의 목차">
          {chapters.map((c, i) => (
            <button
              key={`${c.at}-${i}`}
              type="button"
              className={`pp-lesson${i === chapter ? " is-current" : ""}`}
              style={{ paddingLeft: `${12 + c.level * 12}px`, textAlign: "left" }}
              onClick={() => seek(c.at)}
              disabled={!src || broken}
            >
              {c.title}
              <small>{fmt(c.at)}</small>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
