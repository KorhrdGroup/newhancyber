import Link from "next/link";
import { Fragment } from "react";
import { essentialCards, type EssentialCard } from "./homeData";

function CardLabel({ card }: { card: EssentialCard }) {
  const lines = card.label.split("\n");
  return lines.map((line, i) => (
    <Fragment key={line}>
      {/* 원본처럼 줄바꿈 뒤에 공백을 둬서, 모바일에서 br 이 숨겨져도 단어가 붙지 않게 한다 */}
      {i > 0 && (
        <>
          <br className={card.desktopOnlyBreak ? "br-desktop-only" : undefined} />{" "}
        </>
      )}
      {line}
    </Fragment>
  ));
}

/** 한평생원격교육원 학습자 필수 Check! */
export default function EssentialCheck() {
  return (
    <section className="essential-check-section">
      <div className="essential-check-container">
        <h3 className="essential-check-title">한평생원격교육원 학습자 필수 Check!</h3>
        <div className="essential-check-cards">
          {essentialCards.map((card) => {
            const content = (
              <>
                <div className="essential-card-icon">
                  <img
                    src={`/resources/images/main/check/${card.icon}`}
                    alt={card.alt}
                    className="card-icon-img"
                  />
                </div>
                <div className="essential-card-text">
                  <CardLabel card={card} />
                </div>
              </>
            );

            return card.external ? (
              <a
                key={card.alt}
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className="essential-card"
              >
                {content}
              </a>
            ) : (
              <Link key={card.alt} href={card.href} className="essential-card">
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
