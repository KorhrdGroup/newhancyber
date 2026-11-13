import type { Metadata } from "next";
import ProgramTable, { type Program } from "@/components/learning-support/ProgramTable";
import SectionTabs, { programTabs } from "@/components/learning-support/extra/SectionTabs";

export const metadata: Metadata = { title: "수강지원프로그램" };

const basicPrograms: Program[] = [
  { key: "hwp", name: "한글뷰어", description: "[한글 (hwp)]로 작성된 자료파일을 보실 수 있습니다", icon: "program-01.png", alt: "한글" },
  { key: "word", name: "MS 워드 뷰어", description: "[워드 (doc)]로 작성된 자료파일을 보실 수 있습니다", icon: "program-02.png", alt: "워드" },
  { key: "excel", name: "MS 엑셀 뷰어", description: "[엑셀 (xls)]로 작성된 자료파일을 보실 수 있습니다", icon: "program-03.png", alt: "엑셀" },
  {
    key: "powerpoint",
    name: "MS 파워포인트 뷰어",
    description: "[파워포인트 (ppt)]로 작성된 자료파일을 보실 수 있습니다",
    icon: "program-04.png",
    alt: "파워포인트",
  },
  { key: "pdf", name: "Acrobat Reader", description: "[PDF (pdf)]로 작성된 자료파일을 보실 수 있습니다", icon: "program-05.png", alt: "PDF" },
];

// alt 는 원본 그대로 (기본 프로그램 표에서 복사해 와서 이름과 맞지 않음)
const etcPrograms: Program[] = [
  { key: "ie", name: "Internet Explorer 업데이트", description: "인터넷 익스플로러 업데이트 사이트 입니다.", icon: "program-06.png", alt: "한글" },
  { key: "cert", name: "증명서출력용 설치 프로그램", description: "각종 증명서를 출력하기 위해서 설치해야합니다", icon: "program-07.png", alt: "워드" },
  { key: "mac", name: "맥어드레스 설치 프로그램", description: "맥어드레스 정보를 얻기 위해서 설치해야합니다", icon: "program-07.png", alt: "엑셀" },
  {
    key: "cert-login",
    name: "공인인증로그인 설치 프로그램",
    description: "공인인증서를 이용 로그인하기 위해서 설치해야합니다",
    icon: "program-07.png",
    alt: "파워포인트",
  },
  // 원본 문구가 "[" 로 시작하고 닫는 "]" 가 없다 (원본 그대로)
  { key: "capture", name: "알캡쳐", description: "[모니터 화면을 그대로 캡처 해주는 화면캡처 프로그램 입니다", icon: "program-08.png", alt: "PDF" },
  {
    key: "flash",
    name: "플래시플레이어",
    description: "인터넷 익스플로러 8 이하 브라우저 사용 학습자를 위한 프로그램입니다",
    icon: "program-09.png",
    alt: "파워포인트",
  },
];

export default function LearningProgramPage() {
  return (
    <main className="wrapper">
      <SectionTabs items={programTabs} underHeader />
      <div className="container lx-page lx-page--plain">
        <h1 className="page-title">수강지원프로그램</h1>
        <p className="lx-desc">학습 자료를 열어 보거나 증명서를 출력할 때 필요한 프로그램입니다. 필요한 것을 골라 내려받으세요.</p>
        <ProgramTable title="기본 프로그램" group="basic" programs={basicPrograms} />
        <ProgramTable title="기타 프로그램" group="etc" programs={etcPrograms} />
      </div>
    </main>
  );
}
