import type { Metadata } from "next";
import Link from "next/link";
import SectionTabs, { mobileGuideTabs } from "@/components/learning-support/extra/SectionTabs";
import { CONTACT_PHONE } from "@/components/layout/MobileFooter";

export const metadata: Metadata = { title: "모바일학습가이드" };

/*
 * 원본(/stdSup/mobileinfo.asp, 실제 사이트 포함)은 "페이지 준비중입니다" 그림만 있어 새로 썼다.
 * 이 사이트의 다른 안내와 맞춤: 출석·과제·시험은 공동인증서 로그인, 등록한 학습자 PC에서만 인정, 시험은 PC에서만.
 * TODO: 교육원의 모바일 수강 정책(모바일 출석 인정 여부 등)이 정해지면 문구를 맞춘다.
 */
const abilities: { task: string; mobile: string; pc: string }[] = [
  { task: "공지사항·학사일정 확인", mobile: "가능", pc: "가능" },
  { task: "수강신청·결제", mobile: "가능", pc: "가능" },
  { task: "진도율·성적·결제 내역 확인", mobile: "가능", pc: "가능" },
  { task: "강의 다시 보기(복습)", mobile: "가능", pc: "가능" },
  { task: "출석이 인정되는 강의 듣기", mobile: "불가능", pc: "등록한 PC에서 가능" },
  { task: "과제 제출", mobile: "불가능", pc: "가능" },
  { task: "중간고사·기말고사", mobile: "불가능", pc: "등록한 PC에서 가능" },
];

const sections: { title: string; items: string[] }[] = [
  {
    title: "모바일로 접속하기",
    items: [
      "스마트폰의 인터넷 앱(크롬, 사파리, 삼성 인터넷)에서 한평생원격교육원 홈페이지에 접속합니다. 따로 설치할 앱은 없습니다.",
      "PC와 같은 아이디·비밀번호로 로그인한 뒤, 메뉴의 [나의 강의실]에서 수강 중인 과목을 볼 수 있습니다.",
      "인터넷 앱의 [홈 화면에 추가]를 누르면 바탕화면에서 바로 들어올 수 있습니다.",
    ],
  },
  {
    title: "권장 환경",
    items: [
      "Android 10 이상, iOS 15 이상의 스마트폰·태블릿을 권장합니다.",
      "인터넷 앱은 최신 버전으로 업데이트해 주세요.",
      "강의 영상은 데이터를 많이 쓰므로 Wi-Fi에서 보는 것을 권장합니다.",
    ],
  },
  {
    title: "강의가 잘 안 나올 때",
    items: [
      "영상이 멈추거나 소리가 나지 않으면 인터넷 앱을 완전히 닫았다가 다시 열어 주세요.",
      "무음 모드나 블루투스 이어폰 연결 상태를 확인해 주세요.",
      "그래도 안 되면 다른 인터넷 앱(예: 크롬 ↔ 사파리)으로 접속해 보세요.",
    ],
  },
];

export default function LearningMobileGuidePage() {
  return (
    <main className="wrapper">
      <SectionTabs items={mobileGuideTabs} underHeader />
      <div className="container lx-page">
        <h1 className="page-title">모바일학습가이드</h1>
        <p className="lx-desc">스마트폰으로 한평생원격교육원을 이용하는 방법입니다. 출석·과제·시험은 PC에서 해 주세요.</p>

        <section className="lx-panel">
          <h2 className="lx-section-title">모바일과 PC에서 할 수 있는 일</h2>
          <div className="lx-table-scroll">
            <table className="ds-table lx-table">
              <thead>
                <tr>
                  <th>할 일</th>
                  <th>모바일</th>
                  <th>PC</th>
                </tr>
              </thead>
              <tbody>
                {abilities.map((row) => (
                  <tr key={row.task}>
                    <td className="is-left">{row.task}</td>
                    <td className={row.mobile === "불가능" ? "ds-text-danger" : undefined}>{row.mobile}</td>
                    <td>{row.pc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="lx-notes">
            <li className="page-list-item">
              대리출석·대리시험을 막기 위해 출석·과제·시험은 공동인증서로 로그인한 뒤, 등록한 학습자 PC에서만 인정됩니다.
            </li>
          </ul>
        </section>

        {sections.map((section) => (
          <section key={section.title} className="lx-panel">
            <h2 className="lx-section-title">{section.title}</h2>
            <ul className="lx-notes">
              {section.items.map((item) => (
                <li key={item} className="page-list-item">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}

        <p className="lx-callout">
          학습자 PC 등록은 <Link href="/my-page/pc">마이페이지 &gt; 내 정보 &gt; PC 등록</Link>에서, 공동인증서는{" "}
          <Link href="/learning-support/mobile-guide/certificate">공동인증서 안내</Link>에서 확인해 주세요. 그 밖에 궁금한 점은
          학습지원센터({CONTACT_PHONE})로 문의해 주세요.
        </p>
      </div>
    </main>
  );
}
