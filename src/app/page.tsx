import { PHASE_PRODUCTION_BUILD } from "next/constants";
import FloatingMenu from "@/components/home/FloatingMenu";
import MobileSocialFooter from "@/components/home/MobileSocialFooter";
import type { NoticePost } from "@/components/home/homeData";
import SampleHome, { type MainBoardPosts } from "@/components/home-sample/SampleHome";
import { kstDate } from "@/components/learning-support/DbBoard";
import { isDbConfigured } from "@/lib/db/client";
import { latestBoardPosts, type BoardListRow } from "@/lib/db/boardPosts";
import { getRecruitingTerm } from "@/lib/courses";
import { getLayoutSite, getMainSite } from "@/lib/site";
/* 떠 있는 메뉴가 배너를 가리지 않게 하는 규칙이 기존 메인 스타일에 있어 같이 불러온다 */
import "@/styles/home.css";

/**
 * 메인 공지 탭은 DB 게시판(공지사항 · 학사일정 · 실습공지사항)에서 최근 글 5개씩.
 * 메인은 접속이 가장 많아서 매번 DB 를 읽지 않고 1분마다 새로 만든다 — 관리자가 쓴 글은 1분 안에 보인다.
 */
export const revalidate = 60;

const NEW_DAYS = 7;

async function loadMainBoardPosts(): Promise<MainBoardPosts> {
  if (!isDbConfigured()) return null;
  const toPosts = (rows: BoardListRow[]): NoticePost[] =>
    rows.map((r) => ({
      id: r.postId,
      title: r.title,
      date: kstDate(r.createdAt),
      isNew: Date.now() - r.createdAt.getTime() < NEW_DAYS * 24 * 60 * 60 * 1000,
    }));
  try {
    const [notice, schedule, practice] = await Promise.all([
      latestBoardPosts("notice", 5),
      latestBoardPosts("academic_schedule", 5),
      latestBoardPosts("practice_notice", 5),
    ]);
    return { notice: toPosts(notice), schedule: toPosts(schedule), practice: toPosts(practice) };
  } catch (err) {
    const e = err as { name?: string; number?: number };
    console.error("메인 공지 읽기 실패", [e?.name, e?.number].filter(Boolean).join(" "));
    // 1분마다 새로 만들다가 DB 가 잠깐 안 되면 오류를 다시 던진다 — Next 는 그때 마지막으로 잘 만든 메인을 계속 보여 준다
    // (잡아서 null 을 돌려주면 「불러올 수 없어요」 메인이 정상 결과로 1분 동안 저장된다).
    // 빌드 중(아직 잘 만든 메인이 없다)과 개발 서버에서는 메인이 통째로 깨지지 않게 안내 문구로 둔다.
    if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD && process.env.NODE_ENV === "production") throw err;
    return null;
  }
}

/** 메인 — 메인 시안 화면 (예전 /sample) */
export default async function HomePage() {
  // 메인 배너 · 팝업은 관리자 「홈페이지 관리」(DB 027) — 비거나 못 읽으면 코드 배너, 팝업 없음
  // 「지금 모집 중」은 LMS 「학사일정 관리」의 학기 — DB 가 없으면 코드 값, 받을 학기가 없으면 줄을 숨긴다
  const [boardPosts, { banners, popups }, { info }, term] = await Promise.all([
    loadMainBoardPosts(),
    getMainSite(),
    getLayoutSite(),
    getRecruitingTerm(),
  ]);
  return (
    <>
      <SampleHome boardPosts={boardPosts} banners={banners} popups={popups} term={term} />
      {/* 모바일 맨 아래 SNS · 사업자 정보 (기존 메인과 같은 부품) */}
      <MobileSocialFooter info={info} />
      <FloatingMenu />
    </>
  );
}
