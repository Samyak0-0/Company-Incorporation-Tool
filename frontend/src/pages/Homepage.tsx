import { Link } from "react-router";
import styles from "./Homepage.module.css";
import incorporate from "../assets/images/incorporate.jpg";
import { FaArrowRight } from "react-icons/fa";
import { FaQuoteLeft } from "react-icons/fa";
import { FaQuoteRight } from "react-icons/fa";
import { useState, useRef } from "react";

interface Position {
  x: number;
  y: number;
}

function Homepage() {
  const magnetoRef = useRef<HTMLDivElement>(null);

  const [outerPos, setOuterPos] = useState<Position>({ x: 0, y: 0 });
  const [textPos, setTextPos] = useState<Position>({ x: 0, y: 0 });

  function activateMagneto(e: React.MouseEvent<HTMLDivElement>): void {
    const magneto = magnetoRef.current;
    if (!magneto) return;

    const boundBox = magneto.getBoundingClientRect();

    const newX = (e.clientX - boundBox.left) / magneto.offsetWidth - 0.5;
    const newY = (e.clientY - boundBox.top) / magneto.offsetHeight - 0.5;

    setOuterPos({
      x: newX * 20,
      y: newY * 20,
    });

    setTextPos({
      x: newX * 40,
      y: newY * 40,
    });
  }

  function resetMagneto() {
    setOuterPos({ x: 0, y: 0 });
    setTextPos({ x: 0, y: 0 });
  }

  return (
    <div className={styles.homepage}>
      <div className={`${styles["word-content"]} ml-8 `}>
        <div className="text-6xl mb-8">IncorpFirm</div>
        <div className={`${styles.subtext} italic text-lg mb-8`}>
          <FaQuoteLeft className="inline align-middle mr-3" />
          Incorporate your Company or Business Online within 10mins. <br />
          Ease the Hassle and Simplify the Traditional Company Incorporation
          Process.
          <FaQuoteRight className="inline align-middle ml-3" />
        </div>
        <div>
          <Link to={"/incorporate"}>
            <div
              className={`${styles["call-to-action"]} ${styles.magneto} flex cursor-pointer  items-center p-4`}
              ref={magnetoRef}
              style={{
                transform: `translate(${outerPos.x}px, ${outerPos.y}px)`,
              }}
              onMouseMove={activateMagneto}
              onMouseLeave={resetMagneto}
            >
              <span
                className={styles["magneto-text"]}
                style={{
                  transform: `translate(${textPos.x}px, ${textPos.y}px)`,
                }}
              >
                Incorporate Now
              </span>{" "}
              <FaArrowRight
                className={`${styles["magneto-text"]} ml-4`}
                style={{
                  transform: `translate(${textPos.x}px, ${textPos.y}px)`,
                }}
              />
            </div>
          </Link>
        </div>
      </div>
      <div className={styles["diamond-box"]}>
        <img src={incorporate} alt="company-people-working" />
      </div>
    </div>
  );
}

export default Homepage;
