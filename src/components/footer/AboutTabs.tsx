"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  DirectionsTab,
  FeaturesTab,
  GreetingTab,
  MobileAboutContent,
  PhilosophyTab,
  ScholarshipTab,
} from "./AboutContent";

const tabs = [
  { key: "greeting", label: "인사말", Panel: GreetingTab },
  { key: "philosophy", label: "교육 이념", Panel: PhilosophyTab },
  { key: "features", label: "교육원 특징", Panel: FeaturesTab },
  { key: "scholarship", label: "장학제도", Panel: ScholarshipTab },
  { key: "directions", label: "오시는길", Panel: DirectionsTab },
] as const;

type TabKey = (typeof tabs)[number]["key"];

const isTabKey = (value: string): value is TabKey => tabs.some((tab) => tab.key === value);

const subscribeHash = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};

/** 주소의 #tab-xxx 로 열 탭 (사이트맵·메인 "장학제도" 카드가 이 주소로 들어온다) */
function useHashTab(): TabKey | null {
  const hash = useSyncExternalStore(
    subscribeHash,
    () => window.location.hash,
    () => "",
  );
  const name = hash.startsWith("#tab-") ? hash.slice("#tab-".length) : "";
  return isTabKey(name) ? name : null;
}

/** 교육원 소개 탭 (데스크톱). 모바일은 탭 없이 MobileAboutContent 를 보여준다. */
export default function AboutTabs() {
  const hashTab = useHashTab();
  const [selected, setSelected] = useState<TabKey | null>(null);
  const activeTab = selected ?? hashTab ?? "greeting";

  // 해시가 바뀌면(사이트맵 링크·뒤로가기 등) 클릭으로 고른 탭을 버리고 해시 탭을 따른다
  useEffect(() => {
    const onHashChange = () => setSelected(null);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  const navRef = useRef<HTMLElement>(null);

  // 해시로 들어오면 탭 네비게이션이 보이게 스크롤 (원본: nav 위치 - 100px)
  useEffect(() => {
    if (!hashTab || !navRef.current) return;
    const top = navRef.current.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: "smooth" });
  }, [hashTab]);

  return (
    <>
      <nav ref={navRef} className="about-nav">
        <div className="about-nav-container">
          <ul className="about-nav-list">
            {tabs.map((tab) => (
              <li
                key={tab.key}
                className={`about-nav-item${tab.key === activeTab ? " active" : ""}`}
                onClick={() => setSelected(tab.key)}
              >
                <a
                  href="#"
                  role="button"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  {tab.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <MobileAboutContent />

      <div className="container desktop-only">
        {tabs.map(({ key, Panel }) => (
          <div key={key} className={`about-tab-content${key === activeTab ? " active" : ""}`} id={`tab-${key}`}>
            <Panel />
          </div>
        ))}
      </div>
    </>
  );
}
