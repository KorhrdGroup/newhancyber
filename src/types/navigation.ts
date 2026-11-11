export interface NavLink {
  label: string;
  href: string;
  /** 퍼블리싱에서 "추후 오픈 예정"으로 숨겨둔 메뉴 */
  hidden?: boolean;
  /** 이 탭을 켤 다른 주소들 (탭 하나에 여러 화면을 묶었을 때) */
  match?: string[];
}

export interface NavGroup extends NavLink {
  children?: NavLink[];
  /** 수강신청 메뉴의 "마감임박" 같은 뱃지 */
  badge?: string;
}
