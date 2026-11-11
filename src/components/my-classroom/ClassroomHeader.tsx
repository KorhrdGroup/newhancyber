/** 나의 강의실 제목 (과목 구분은 머리글의 파란 하위 메뉴가 맡는다) */
export default function ClassroomHeader({ title, actions }: { title: string; actions?: React.ReactNode }) {
  return (
    <div className="cr-head">
      <div>
        <h2 className="cr-title">{title}</h2>
        <p className="cr-desc">수강 중인 과목의 강의를 듣고, 시험·과제에 참여하세요.</p>
      </div>
      {actions && <div className="cr-actions">{actions}</div>}
    </div>
  );
}
