"use client";

import Link from "next/link";
import { useState } from "react";
import { noticeTabs, type NoticeTabKey } from "./homeData";

/** 공지사항 / 학사일정 / 실습공지 탭 */
export default function NoticeBoard() {
  const [activeTab, setActiveTab] = useState<NoticeTabKey>("notice");

  return (
    <div className="notice-board">
      <h3 className="notice-title">공지사항</h3>
      <div className="notice-tabs">
        {noticeTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`notice-tab${tab.key === activeTab ? " active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {noticeTabs.map((tab) => (
        <div
          key={tab.key}
          className={`notice-list notice-list-${tab.key}`}
          style={tab.key === activeTab ? undefined : { display: "none" }}
        >
          {tab.posts.map((post) => (
            <Link key={post.id} href={`${tab.basePath}/${post.id}`} className="notice-item">
              {post.isNew && <span className="notice-badge">N</span>}
              <span className="notice-text">{post.title}</span>
              <span className="notice-date">{post.date}</span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
