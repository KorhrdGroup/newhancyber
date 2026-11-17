import type { ReactNode } from "react";

/** 영상정보 처리기기 운영·관리 방침 (원본 hpsedu.co.kr sID=1105 두 번째 탭) */

function Article({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="legal-article">
      <h2 className="legal-article-title">{title}</h2>
      {children}
    </section>
  );
}

function InfoRows({ rows }: { rows: [string, string][] }) {
  return (
    <div className="legal-table legal-table--wide">
      <table className="ds-table ds-table--info">
        <tbody>
          {rows.map(([th, td]) => (
            <tr key={th}>
              <th scope="row">{th}</th>
              <td>{td}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="legal-bullets">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function SubLines({ mark, lines }: { mark?: (i: number) => string; lines: string[] }) {
  return (
    <ol className="legal-sub">
      {lines.map((line, i) => (
        <li key={line}>
          <span className="legal-mark">{mark ? mark(i) : "·"}</span>
          <span>{line}</span>
        </li>
      ))}
    </ol>
  );
}

export default function VideoPolicy() {
  return (
    <>
      <div className="legal-video-intro">
        <img src="/resources/images/footer/privacy/privacy-11.png" alt="영상정보처리기기" className="legal-video-icon" />
        <p className="legal-text">
          ㈜한평생그룹(이하 회사)은 영상정보처리기기 운영·관리 방침을 통해 본 회사에서 처리하는 영상정보가 어떠한 용도와 방식으로 이용 관리되고 있는지
          알려드립니다.
        </p>
      </div>

      <Article title="1. 영상정보처리기기의 설치근거 및 목적">
        <p className="legal-text">회사는 「개인정보보호법」 제25조 제1항에 따라 다음과 같은 목적으로 영상정보처리기기를 설치·운영 합니다.</p>
        <Bullets items={["폭력, 도난방지 및 안전사고 예방", "시설안전 및 화재 예방", "수강생의 권익 보호"]} />
      </Article>

      <Article title="2. 영상정보처리기기의 설치 대수, 설치 위치 및 촬영 범위">
        <InfoRows
          rows={[
            ["설치 대수", "4대"],
            ["설치 위치 및 촬영 범위", "로비, 복도 등 건물 내부"],
          ]}
        />
      </Article>

      <Article title="3. 관리책임자 및 접근권한자">
        <ol className="legal-items">
          <li>
            <span className="legal-mark">1)</span>
            <div>
              <p className="legal-text">관리책임자</p>
              <SubLines lines={["성명/직급 : 양병웅 대표", "소속 : ㈜한평생그룹", "연락처 : 02-2135-6514"]} />
            </div>
          </li>
          <li>
            <span className="legal-mark">2)</span>
            <div>
              <p className="legal-text">접근권한자</p>
              <SubLines lines={["성명 : 강나윤", "소속 : 학사운영팀", "연락처 : 070-8652-2577"]} />
            </div>
          </li>
        </ol>
      </Article>

      <Article title="4. 영상정보의 촬영 시간, 보관 기간, 보관 장소 및 처리 방법">
        <InfoRows
          rows={[
            ["촬영 시간", "24시간"],
            ["보관기관", "5일"],
            ["보관장소", "관제센터"],
            [
              "처리방법",
              "개인영상정보의 목적 외 이용, 제3자 제공, 파기, 열람 등 요구에 관한 사항을 기록·관리하고, 보관기간 만료 시 복원이 불가능한 방법으로 영구 삭제(출력물의 경우 파쇄 또는 소각)합니다.",
            ],
          ]}
        />
      </Article>

      <Article title="5. 개인영상정보의 확인 방법 및 장소">
        <Bullets items={["확인 방법 : 접근권한자에게 미리 연락하고 회사를 방문하시면 확인 가능합니다.", "확인 장소 : 별도로 연락"]} />
      </Article>

      <Article title="6. 정보주체의 영상정보 열람 등 요구에 대한 조치">
        <Bullets
          items={[
            "귀하는 개인영상정보에 관하여 열람 또는 존재확인, 삭제를 원하는 경우 언제든지 본 회사에 요구하실 수 있습니다. 단, 귀하가 촬영된 개인영상정보 및 명백히 정보주체의 급박한 생명, 신체, 재산의 이익을 위하여 필요한 개인영상정보에 한정됩니다.",
            "본 회사는 개인영상정보에 관하여 열람 또는 존재확인, 삭제를 요구받은 경우 지체 없이 필요한 조치를 취하겠습니다.",
            "본 회사는 수집중인 개인영상정보에 대해 정보주체가 열람을 요청하는 경우, 열람을 요청한 자가 본인이거나 정당한 대리인인지를 확인하기 위하여 주민등록증, 운전면허증, 여권 등의 신분증명서를 제출 받아, 확인 후에 필요한 조치를 취하겠습니다.",
            <>
              단, 예외적으로 다음과 같은 경우에는 개인정보 열람 또는 존재확인, 삭제요구에 대해 본 회사는 거부할 수 있으며, 이 경우 10일 이내 서면 등으로 거부
              사유를 통지하여 드립니다.
              <SubLines
                mark={(i) => `${i + 1}.`}
                lines={["개인정보의 보관기관이 경과하여 파기한 경우", "기타 귀하의 열람 등을 거부할만한 정당한 사유가 존재하는 경우"]}
              />
            </>,
          ]}
        />
      </Article>

      <Article title="7. 영상정보의 안전성 확보 조치">
        <p className="legal-text">
          본 회사에서 처리하는 영상정보는 암호화 조치 등을 통하여 안전하게 관리되고 있습니다. 또한 회사는 개인영상정보보호를 위한 관리적 대책으로서 개인정보에
          대한 접근 권한을 차등부여하고 있고, 개인영상정보의 위·변조 방지를 위하여 개인영상정보의 생성 일시, 열람 시 열람 목적·열람자·열람 일시 등을 기록하여
          관리하고 있습니다. 이 외에도 개인영상정보의 안전한 물리적 보관을 위하여 잠금 장치를 설치하고 있습니다.
        </p>
      </Article>

      <Article title="8. 영상정보 처리기기 운영·관리 방침 변경에 관한 사항">
        <p className="legal-text">
          법령, 정책 또는 보안기술의 변경에 따라 본 영상정보처리기기 운영·관리방침의 내용에 추가, 삭제 및 수정이 있을 경우에는 정보주체가 쉽게 확인할 수 있도록
          회사 홈페이지를 통해 변경사유 및 내용 등을 공지하도록 하겠습니다.
        </p>
      </Article>
    </>
  );
}
