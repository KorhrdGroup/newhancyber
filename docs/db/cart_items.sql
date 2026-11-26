/*
  장바구니 (dbo.cart_items) — 홈페이지 회원이 수강신청 화면에서 담은 차수.
  홈페이지(newhancyber)가 넣고 빼며, 결제 신청을 하면 그 차수는 장바구니에서 빠진다.
  LMS 관리자는 읽기만 한다 (나중에 「장바구니 현황」 화면을 붙일 때).

  실행: 서버 관리자 계정으로 한 번 (hancyber_app 은 테이블을 만들 권한이 없다).
        몇 번 실행해도 같은 결과 — 이미 있으면 건너뛴다.
  newhancyber-db 저장소의 sql/schema/ 에 다음 번호로 넣어 두면 다른 컴퓨터의 로컬 DB 에도 생긴다.

  - 한 회원이 같은 차수를 두 번 담지 못한다 (UQ_cart_items_member_class).
  - 차수 · 회원이 지워지면 장바구니 줄도 같이 지워진다 (ON DELETE CASCADE).
    LMS 「차수 관리」의 삭제는 수강 · 결제 항목 등만 확인하므로, 장바구니 줄 때문에 차수 삭제가 막히지 않게 한다.
  - 시각은 다른 표와 같이 SYSDATETIME() (Azure 는 UTC).
*/
IF OBJECT_ID(N'dbo.cart_items', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.cart_items (
    cart_item_id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_cart_items PRIMARY KEY,
    member_id    INT NOT NULL CONSTRAINT FK_cart_items_member REFERENCES dbo.members (member_id) ON DELETE CASCADE,
    class_id     INT NOT NULL CONSTRAINT FK_cart_items_class REFERENCES dbo.classes (class_id) ON DELETE CASCADE,
    created_at   DATETIME2(0) NOT NULL CONSTRAINT DF_cart_items_created_at DEFAULT (SYSDATETIME()),
    CONSTRAINT UQ_cart_items_member_class UNIQUE (member_id, class_id)
  );
  -- 차수 쪽에서 찾을 때 (관리자 「이 차수를 담은 회원」, 차수 삭제의 CASCADE)
  CREATE INDEX IX_cart_items_class ON dbo.cart_items (class_id);
END;
