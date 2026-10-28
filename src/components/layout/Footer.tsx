import Link from "next/link";
import { footerLinks } from "@/lib/navigation";
import PageMobileFooter from "./PageMobileFooter";

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          <ul className="footer-links">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </footer>
      <PageMobileFooter />
    </>
  );
}
