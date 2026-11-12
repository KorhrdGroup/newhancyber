import type { BoardPost } from "../boardData";

/**
 * 관련기관 소식 샘플 데이터.
 * 원본 게시판(/bbs/bbsList.asp?bbs_mng_idx=14)에 아직 글이 없어 지어낸 글이다.
 * TODO: API — 관련기관 소식 목록·상세를 서버에서 받아온다.
 */

export interface NewsPost {
  id: string;
  number: string;
  title: string;
  date: string;
  isNotice?: boolean;
  fileName?: string;
  body: string[];
}

export const newsPosts: NewsPost[] = [
  {
    id: "6",
    number: "공지",
    isNotice: true,
    title: "[국가평생교육진흥원] 2027년 2월 학위 신청 안내",
    date: "26.11.03",
    fileName: "2027년_2월_학위신청_안내.pdf",
    body: [
      "국가평생교육진흥원에서 2027년 2월 학위 신청 일정을 안내했습니다.",
      "학위 신청은 학점은행 홈페이지(www.cb.or.kr)에서 하실 수 있으며, 학위 수여 요건(전공·교양·일반 학점)을 모두 채워야 합니다.",
      "신청 기간과 제출 서류는 첨부파일을 확인해 주세요.",
    ],
  },
  {
    id: "5",
    number: "5",
    title: "[국가평생교육진흥원] 학점인정 신청 기간 안내",
    date: "26.10.20",
    body: [
      "학점은행제 학습과목의 학점인정 신청 기간을 안내합니다.",
      "교육원에서 수료한 과목은 학습자가 직접 학점인정 신청을 해야 학점으로 인정됩니다.",
      "차수별 학점인정 신청일은 학습지원 > 학사일정 > 연간 학사일정에서 확인해 주세요.",
    ],
  },
  {
    id: "4",
    number: "4",
    title: "[한국사회복지사협회] 사회복지사 자격증 발급 신청 안내",
    date: "26.09.30",
    body: [
      "사회복지사 자격 요건을 갖춘 학습자는 한국사회복지사협회 홈페이지에서 자격증 발급을 신청할 수 있습니다.",
      "발급 신청 전 학위·과목 이수 요건과 현장실습 이수 여부를 꼭 확인해 주세요.",
    ],
  },
  {
    id: "3",
    number: "3",
    title: "[국가평생교육진흥원] 평생교육바우처 신청 안내",
    date: "26.08.18",
    body: [
      "평생교육바우처는 학습자가 스스로 학습 계획을 세워 강좌를 들을 수 있도록 이용권을 지원하는 사업입니다.",
      "신청 대상과 기간은 평생교육바우처 홈페이지에서 확인해 주세요.",
    ],
  },
  {
    id: "2",
    number: "2",
    title: "[국가평생교육진흥원] 학점은행 홈페이지 시스템 점검 안내",
    date: "26.07.25",
    body: [
      "시스템 점검으로 학점은행 홈페이지 이용이 잠시 중단됩니다.",
      "점검 시간에는 학습자 등록, 학점인정 신청, 증명서 발급을 이용할 수 없으니 미리 확인해 주세요.",
    ],
  },
  {
    id: "1",
    number: "1",
    title: "[한국보건복지인력개발원] 보육교사 자격증 신청 안내",
    date: "26.06.12",
    body: [
      "보육교사 자격 취득 요건을 갖춘 학습자는 보육교사 자격관리 사이트에서 자격증을 신청할 수 있습니다.",
      "신청 전 이수 과목과 보육실습 이수 여부를 확인해 주세요.",
    ],
  },
];

const href = (id: string) => `/learning-support/notice/news/${id}`;

/** 공지사항 게시판 부품(BoardTable·MobileBoardList)에 넘기는 모양 */
export const newsBoardPosts: BoardPost[] = newsPosts.map((post) => ({
  number: post.number,
  title: post.title,
  date: post.date,
  isNotice: post.isNotice,
  emphasized: post.isNotice,
  href: href(post.id),
}));

export function getNewsWithSiblings(id: string) {
  const index = newsPosts.findIndex((post) => post.id === id);
  if (index < 0) return undefined;
  // 목록이 최신 글부터라서 앞 칸이 다음글, 뒤 칸이 이전글이다
  const toLink = (post?: NewsPost) => (post ? { title: post.title, href: href(post.id) } : undefined);
  return { post: newsPosts[index], next: toLink(newsPosts[index - 1]), prev: toLink(newsPosts[index + 1]) };
}
