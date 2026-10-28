import MobileFooter from "@/components/layout/MobileFooter";
import { socialLinks } from "./homeData";

/** 모바일 소셜 링크 + 모바일 푸터 (데스크톱 푸터는 모바일에서 숨김) */
export default function MobileSocialFooter() {
  return (
    <section className="mobile-social-footer-section">
      <div className="mobile-social-section">
        <div className="mobile-footer-social">
          {socialLinks.map((social) => (
            <a key={social.label} href={social.href} className="mobile-footer-social-item">
              <img src={social.icon} alt={social.label} />
            </a>
          ))}
        </div>
      </div>

      <MobileFooter />
    </section>
  );
}
