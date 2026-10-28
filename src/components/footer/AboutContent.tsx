/** 교육원 소개 본문 (원본 footer/about.html 에서 변환). 탭 전환은 AboutTabs 가 맡는다. */

/** 모바일 전용: 비전·교육 이념·미션·오시는 길을 한 화면에 */
export function MobileAboutContent() {
  return (
    <div className="mobile-about-content mobile-only">
      {/* 비전 섹션 */}
      <div className="mobile-about-vision">
        <h2 className="mobile-about-section-title">비전</h2>
        <div className="mobile-about-vision-box">
          <p className="mobile-about-vision-text">
            모든 배움이 기회가 되고,
            <br />
            그 기회가 한 사람의 인생을 변화시키는 교육원
          </p>
        </div>
      </div>
      {/* 교육 이념 섹션 */}
      <div className="mobile-about-philosophy">
        <h2 className="mobile-about-section-title" style={{ margin: "40px 0" }}>교육 이념</h2>
        {/* 교육 이념 1 */}
        <div className="mobile-about-philosophy-item">
          <div className="mobile-about-philosophy-image">
            <img src="/resources/images/footer/about/about-01.png" alt="배움의 기회를 누구나에게" className="mobile-about-philosophy-img" />
          </div>
          <h3 className="mobile-about-philosophy-title">배움의 기회를 누구나에게</h3>
          <p className="mobile-about-philosophy-text">
            나이, 환경, 경력에 관계없이 모든 사람이 배움을 통해
            <br />
            새로운 시작을 할 수 있도록 돕습니다.
          </p>
        </div>
        {/* 교육 이념 2 */}
        <div className="mobile-about-philosophy-item">
          <div className="mobile-about-philosophy-image">
            <img src="/resources/images/footer/about/about-02.png" alt="실무 중심의 전문교육" className="mobile-about-philosophy-img" />
          </div>
          <h3 className="mobile-about-philosophy-title">실무 중심의 전문교육</h3>
          <p className="mobile-about-philosophy-text">
            현장의 요구에 맞춘 실질적인 교육과정으로
            <br />
            지식이 아닌 &apos;역량&apos;을 길러드립니다.
          </p>
        </div>
        {/* 신뢰 기반의 학습지원 */}
        <div className="mobile-about-philosophy-item">
          <div className="mobile-about-philosophy-image">
            <img src="/resources/images/footer/about/about-03.png" alt="신뢰 기반의 학습지원" className="mobile-about-philosophy-img" />
          </div>
          <h3 className="mobile-about-philosophy-title">신뢰 기반의 학습지원</h3>
          <p className="mobile-about-philosophy-text">
            체계적이고 투명한 학습관리로 처음부터
            <br />
            자격 취득, 진로 설계까지 전 과정을 함께합니다.
          </p>
        </div>
        {/* 지속 가능한 성장 */}
        <div className="mobile-about-philosophy-item">
          <div className="mobile-about-philosophy-image">
            <img src="/resources/images/footer/about/about-04.png" alt="지속 가능한 성장" className="mobile-about-philosophy-img" />
          </div>
          <h3 className="mobile-about-philosophy-title">지속 가능한 성장</h3>
          <p className="mobile-about-philosophy-text">
            배움이 일회성이 아닌, 삶 속에서 계속 이어질 수 있도록
            <br />
            평생학습의 문화를 확산시킵니다.
          </p>
        </div>
      </div>
      {/* 미션 문구 */}
      <div className="mobile-about-mission">
        <p className="mobile-about-mission-text">
          저희 덧셈교육원은 &quot;배움이 곧 기회가 되는 사회&quot;를 만들어가기 위해 앞으로도 학습자
          <br />
          한 분 한 분의 내일을 응원하며 함께하겠습니다.
        </p>
      </div>
      {/* 오시는 길 */}
      <div className="mobile-about-directions">
        <h2 className="mobile-about-section-title">덧셈원격평생교육원 오시는 길</h2>
        <div className="mobile-about-directions-info">
          <div className="mobile-about-directions-item">
            <span className="mobile-about-directions-label">주소</span>
            {" "}
            <span className="mobile-about-directions-value">서울시 도봉로 150다길 64 601호</span>
          </div>
          <div className="mobile-about-directions-item">
            <span className="mobile-about-directions-label">전화번호</span>
            {" "}
            <span className="mobile-about-directions-value">02-2135-5126</span>
          </div>
        </div>
        <div className="mobile-about-directions-map">
          <img src="/resources/images/footer/about/about-map.png" alt="지도" className="mobile-about-map-img" />
        </div>
      </div>
    </div>
  );
}

/** 인사말 탭 */
export function GreetingTab() {
  return (
    <>
      {/* 메인 이미지 */}
      <div className="greeting-main-image">
        <img src="/resources/images/footer/about/about-main-banner.png" alt="교육원 소개" className="greeting-image" />
      </div>
      {/* 본문 내용 */}
      <div className="greeting-content">
        <p>
          저희 교육원은 학점은행제를 중심으로 한 평생교육 전문기관으로, 누구나 배움을 통해 새로운 기회를 얻을 수 있도록 돕는 것을 사명으로 하고 있습니다.
          <br />
          학습자의 상황과 목표는 모두 다르지만, 그 안에서 &quot;조금 더 나은 내일을 향한 열망&quot;이라는 공통된 마음이 있다고 믿습니다.
        </p>
        <p>
          저희는 그 마음을 가장 가까이에서 이해하고, 체계적이고 신뢰할 수 있는 학습관리로 각자의 여정에 함께하고자 합니다.
          <br />
          단순히 학점을 이수하는 과정이 아니라, 배움을 통해 진로를 설계하고, 경력을 확장하며, 자신만의 전문성을 쌓아갈 수 있도록 실질적이고 현장감 있는 교육을 제공하고 있습니다.
        </p>
        <p>
          또한, 학습자 한 분 한 분이 학습 과정 전반에서 혼자 고민하지 않도록 전문 학습담당자가 맞춤 학습설계와 지속적인 학습관리를 지원하고 있습니다.
          <br />
          이를 통해 &quot;배움의 시작부터 자격취득, 그리고 진로의 완성까지 끊김 없는 성장의 여정을 함께 만들어가고자 합니다.
        </p>
        <p>앞으로도 저희 교육원은 더 많은 분들이 배움을 통해 새로운 길을 열어갈 수 있도록 혁신을 멈추지 않고, 신뢰와 진정성을 바탕으로 교육의 본질을 지켜가겠습니다.</p>
        <p>감사합니다.</p>
      </div>
    </>
  );
}

/** 교육 이념 탭 */
export function PhilosophyTab() {
  return (
    <>
      {/* 본문 내용 */}
      <div className="philosophy-intro-content">
        <h1 className="philosophy-intro-title">교육 이념</h1>
        <p className="philosophy-intro-text">배움의 즐거움으로, 삶의 변화를 이끌다</p>
        <p className="philosophy-intro-text">
          덧셈교육원은 누구나 자신의 속도와 방식으로 배울 수 있는
          <br />
          “평생학습의 장(場)”을 만들어가고 있습니다.
          <br />
          교육은 단지 지식을 쌓는 과정이 아니라, 삶을 새롭게 설계하고 스스로의 가능성을 확장해 나가는 여정이라 믿습니다.
        </p>
        <p className="philosophy-intro-text">
          급격하게 변화하는 시대 속에서 오늘의 배움은 내일의 경쟁력이 됩니다.
          <br />
          저희 교육원은 학점은행제를 기반으로, 단순히 학위취득을 넘어 실질적인 경력 설계와 전문성 향상을 지원합니다.
        </p>
        <p className="philosophy-intro-text">
          모든 학습자가 각자의 자리에서 성장의 결실을 맺을 수 있도록 저희는 다음의 가치를 중심으로 교육이념을 세워 나갑니다.
        </p>
      </div>
      {/* 교육이념 그리드 레이아웃 */}
      <div className="philosophy-grid">
        {/* 블록 1 */}
        <div className="philosophy-item">
          <div className="philosophy-image">
            <img src="/resources/images/footer/about/about-01.png" alt="배움의 기회를 누구나에게" className="philosophy-img" />
          </div>
          <div className="philosophy-content">
            <h3 className="philosophy-title">배움의 기회를 누구나에게</h3>
            <p className="philosophy-description">
              나이, 환경, 경력에 관계없이 모든 사람이 배움을 통해
              <br />
              새로운 시작을 할 수 있도록 돕습니다.
            </p>
          </div>
        </div>
        {/* 블록 2 */}
        <div className="philosophy-item">
          <div className="philosophy-image">
            <img src="/resources/images/footer/about/about-02.png" alt="실무 중심의 전문교육" className="philosophy-img" />
          </div>
          <div className="philosophy-content">
            <h3 className="philosophy-title">실무 중심의 전문교육</h3>
            <p className="philosophy-description">
              현장의 요구에 맞춘 실질적인 교육과정으로
              <br />
              지식이 아닌 &apos;역량&apos;을 길러드립니다.
            </p>
          </div>
        </div>
        {/* 블록 3 */}
        <div className="philosophy-item">
          <div className="philosophy-image">
            <img src="/resources/images/footer/about/about-03.png" alt="신뢰 기반의 학습지원" className="philosophy-img" />
          </div>
          <div className="philosophy-content">
            <h3 className="philosophy-title">신뢰 기반의 학습지원</h3>
            <p className="philosophy-description">
              체계적이고 투명한 학습관리로 처음부터
              <br />
              자격 취득, 진로 설계까지 전 과정을 함께합니다.
            </p>
          </div>
        </div>
        {/* 블록 4 */}
        <div className="philosophy-item">
          <div className="philosophy-image">
            <img src="/resources/images/footer/about/about-04.png" alt="지속 가능한 성장" className="philosophy-img" />
          </div>
          <div className="philosophy-content">
            <h3 className="philosophy-title">지속 가능한 성장</h3>
            <p className="philosophy-description">
              배움이 일회성이 아닌, 삶 속에서 계속 이어질 수 있도록
              <br />
              평생학습의 문화를 확산시킵니다.
            </p>
          </div>
        </div>
      </div>
      <h1 className="philosophy-conclusion">
        저희 덧셈교육원은 “배움이 곧 기회가 되는 사회”를 만들어가기 위해 앞으로도 학습자 한 분 한 분의 내일을 응원하며 함께하겠습니다.
      </h1>
    </>
  );
}

/** 교육원 특징 탭 */
export function FeaturesTab() {
  return (
    <>
      <div className="features-content">
        <div className="features-content-inner">
          <h1 className="features-title">덧셈 교육원의 특징</h1>
          <p className="features-subtitle">배움의 기회가 곧 삶의 기회가 될 수 있도록, 덧셈 교육원은 학습자 한 분 한 분의 여정을 세심하게 함께합니다.</p>
        </div>
        {/* 특징 리스트 */}
        <div className="features-list">
          {/* 특징 1 */}
          <div className="feature-item">
            <div className="feature-icon">
              <img src="/resources/images/footer/about/about-05.png" alt="교육부 평가인정" className="feature-icon-img" />
            </div>
            <div className="feature-text">
              <h3 className="feature-title">1. 교육부 평가인정 학점은행제 교육원</h3>
              <p className="feature-description">
                교육부의 신뢰할 수 있는 평가인정을 받아 안정적이고 투명한 학습 환경을 제공합니다. 모든 과정은 국가평생교육진흥원의 기준에 부합합니다.
              </p>
            </div>
          </div>
          {/* 특징 2 */}
          <div className="feature-item">
            <div className="feature-icon">
              <img src="/resources/images/footer/about/about-06.png" alt="1:3 맞춤형 학습설계" className="feature-icon-img" />
            </div>
            <div className="feature-text">
              <h3 className="feature-title">1:3 맞춤형 학습설계 시스템</h3>
              <p className="feature-description">
                학습자의 경력, 학력, 목표에 맞춘 개인별 학습 로드맵을 제공합니다. 학습설계부터 자격 취득, 학위 완성까지 전 과정을 밀착 관리합니다.
              </p>
            </div>
          </div>
          {/* 특징 3 */}
          <div className="feature-item">
            <div className="feature-icon">
              <img src="/resources/images/footer/about/about-07.png" alt="실무 중심 커리큘럼" className="feature-icon-img" />
            </div>
            <div className="feature-text">
              <h3 className="feature-title">실무 중심의 커리큘럼 구성</h3>
              <p className="feature-description">
                이론적 지식을 넘어 실무 경험이 풍부한 강사진의 실질적인 교육 콘텐츠를 제공합니다. 자격 취득 후에도 경력 확장과 취업에 도움이 되도록 구성되었습니다.
              </p>
            </div>
          </div>
          {/* 특징 4 */}
          <div className="feature-item">
            <div className="feature-icon">
              <img src="/resources/images/footer/about/about-08.png" alt="학습자 친화적 시스템" className="feature-icon-img" />
            </div>
            <div className="feature-text">
              <h3 className="feature-title">학습자 친화적 온라인 시스템</h3>
              <p className="feature-description">
                시간과 장소의 제약 없이 언제 어디서나 학습할 수 있는 안정적인 온라인 플랫폼을 구축했습니다. 학습 진행 상황을 직관적으로 확인할 수 있어 편리하게 관리할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/** 장학제도 탭 */
export function ScholarshipTab() {
  return (
    <>
      <div className="scholarship-content">
        <table className="scholarship-table" summary="장학금의 종류와 신청자격 및 조건, 제출서류, 장학금/학비 감면에 관한 내용입니다.">
          <colgroup>
            <col width="200" />
            <col />
            <col width="100" />
            <col width="300" />
          </colgroup>
          <thead>
            <tr className="scholarship-table-header">
              <th colSpan={2}>장학 항목</th>
              <th>혜택</th>
              <th>조건 및 제출서류</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="scholarship-table-category" rowSpan={3}>
                <p>성적장학금</p>
              </td>
              <td>
                <p>최우수(1명)</p>
              </td>
              <td>
                <p>30만원</p>
              </td>
              <td rowSpan={3} className="scholarship-table-detail">
                <p>• 한 학기 5과목 이상 수강자</p>
                <p>• 과락이 없으며, 전 과목 평점 3.0 이상자</p>
                <p>• 제출서류 : 수강후기</p>
                <p>※ 동점자 장학금 지급 우선순위</p>
                <p>1) 정기평가 고득점자</p>
                <p>2) 다수 과목 수강자</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>우 수 (1명)</p>
              </td>
              <td>
                <p>20만원</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>장 려(1명)</p>
              </td>
              <td>
                <p>10만원</p>
              </td>
            </tr>
            <tr>
              <td className="scholarship-table-category" colSpan={2}>
                <p>국가유공자 본인 및 자녀</p>
              </td>
              <td>
                <p>전액면제</p>
              </td>
              <td className="scholarship-table-detail">
                <p>대학수업료 면제자 등 증명서 원본</p>
                <p>(자녀는 가족관계증면서 추가)</p>
              </td>
            </tr>
            <tr>
              <td className="scholarship-table-category" colSpan={2}>
                <p>기초생활수급자</p>
              </td>
              <td>
                <p>50%</p>
              </td>
              <td className="scholarship-table-detail">
                <p>기초생활수급자 증명서 원본</p>
                <p>(최근 1개월 내 발급본)</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

/** 오시는길 탭 */
export function DirectionsTab() {
  return (
    <>
      <div className="directions-content">
        <h1 className="directions-title">덧셈원격평생교육원 오시는 길</h1>
        <div className="directions-info">
          <div className="directions-item">
            <span className="directions-label">주소</span>
            {" "}
            <span className="directions-value">서울특별시 도봉로 150다길 64 601호</span>
          </div>
          <div className="directions-item">
            <span className="directions-label">전화번호</span>
            {" "}
            <span className="directions-value">02-2135-5126</span>
          </div>
        </div>
      </div>
      <img src="/resources/images/footer/about/about-map.png" alt="주소" className="directions-map" />
    </>
  );
}
