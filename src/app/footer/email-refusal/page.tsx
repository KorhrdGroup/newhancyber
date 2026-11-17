import type { Metadata } from "next";
import LegalDoc, { LegalArticle } from "@/components/footer/LegalDoc";

export const metadata: Metadata = { title: "이메일무단수집거부" };

/** 이메일무단수집거부 — 법 조문 한 개를 이용약관과 같은 조항 틀로 (항마다 번호를 나눔) */
export default function EmailRefusalPage() {
  return (
    <LegalDoc title="이메일무단수집거부" desc="홈페이지에 게시된 전자우편주소의 무단 수집을 거부합니다.">
      <LegalArticle
        article={{
          title: "정보통신망법 제50조의 2 (전자우편주소의 무단 수집행위 등 금지)",
          items: [
            { text: "누구든지 전자우편주소의 수집을 거부하는 의사가 명시된 인터넷 홈페이지에서 자동으로 전자우편 주소를 수집하는 프로그램 그 밖의 기술적 장치를 이용하여 전자우편주소를 수집하여서는 아니된다." },
            { text: "누구든지 제1항의 규정을 위반하여 수집된 전자우편주소를 판매.유통하여서는 아니된다." },
            { text: "누구든지 제1항 및 제2항의 규정에 의하여 수집.판매 및 유통이 금지된 전자우편주소임을 알고 이를 정보전송을 이용하여서는 아니된다." },
          ],
        }}
      />
    </LegalDoc>
  );
}
