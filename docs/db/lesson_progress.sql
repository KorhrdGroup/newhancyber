/*
  강의 학습 기록 (dbo.lesson_progress) — 홈페이지 학습창이 수강(enrollments) × 영상 쪽(content_pages)마다 남긴다.
  흐름: CDMS(차시 · 영상 쪽 · 목차 · 자막) → LMS(과목에 콘텐츠 연결) → 홈페이지(재생 · 이 표에 기록 → enrollments.progress · attend_count).

  - watched_seconds : 실제로 본 시간(초). 빨리 감기 · 건너뛰기는 세지 않는다. 쪽의 재생 시간(play_seconds)을 넘지 않는다
  - last_position   : 마지막으로 본 위치(초) — 다시 열면 여기서 이어 본다
  - completed_at    : 재생 시간의 80% 이상 보면 그때 채운다 (한 번 채우면 그대로)
  - 차시 완료 = 그 차시의 영상 쪽이 모두 완료. 진도율 = 완료 차시 ÷ 영상이 있는 전체 차시, 출석 횟수 = 완료 차시 수
    (enrollments.progress · attend_count 는 기록할 때마다 홈페이지가 다시 센다 — LMS 성적 「진도율 80% 미만이면 F」가 이 값을 쓴다)

  실행: 서버 관리자 계정으로 한 번 (hancyber_app 은 테이블을 만들 권한이 없다). 몇 번 실행해도 같은 결과.
  - 수강 · 영상 쪽이 지워지면 기록도 같이 지워진다 (ON DELETE CASCADE) — CDMS 가 영상을 바꿔 쪽을 지우거나 LMS 가 수강을 지울 때 막히지 않게.
  newhancyber-db 저장소의 sql/schema/ 에 다음 번호로 넣어 둔다.
*/
IF OBJECT_ID(N'dbo.lesson_progress', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.lesson_progress (
    enrollment_id   INT NOT NULL CONSTRAINT FK_lesson_progress_enrollment REFERENCES dbo.enrollments (enrollment_id) ON DELETE CASCADE,
    page_id         INT NOT NULL CONSTRAINT FK_lesson_progress_page REFERENCES dbo.content_pages (page_id) ON DELETE CASCADE,
    watched_seconds INT NOT NULL CONSTRAINT DF_lesson_progress_watched DEFAULT (0)
                    CONSTRAINT CK_lesson_progress_watched CHECK (watched_seconds >= 0),
    last_position   INT NOT NULL CONSTRAINT DF_lesson_progress_position DEFAULT (0)
                    CONSTRAINT CK_lesson_progress_position CHECK (last_position >= 0),
    completed_at    DATETIME2(0) NULL,
    created_at      DATETIME2(0) NOT NULL CONSTRAINT DF_lesson_progress_created_at DEFAULT (SYSDATETIME()),
    updated_at      DATETIME2(0) NULL,
    CONSTRAINT PK_lesson_progress PRIMARY KEY (enrollment_id, page_id)
  );
  -- 영상 쪽에서 찾을 때 (CASCADE · LMS 「이 차시를 본 학습자」)
  CREATE INDEX IX_lesson_progress_page ON dbo.lesson_progress (page_id);
END;
