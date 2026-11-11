import type { Metadata } from "next";
import PopupShell from "@/components/my-classroom/PopupShell";
import ReviewForm from "@/components/my-classroom/popups/ReviewForm";
import { getCourse } from "@/components/my-classroom/classroomData";

export const metadata: Metadata = { title: "수강후기 쓰기" };

export default async function ReviewWritePopup({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = getCourse(courseId);
  return (
    <PopupShell title="수강후기 쓰기" sub={course.title} footer={null}>
      <p className="pp-text ds-mb-16">
        쓴 후기는 수강신청 &gt; 수강후기에 올라갑니다. 욕설이나 광고가 있으면 지워질 수 있습니다.
      </p>
      <ReviewForm />
    </PopupShell>
  );
}
