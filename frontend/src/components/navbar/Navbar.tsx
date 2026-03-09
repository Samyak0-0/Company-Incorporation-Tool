import { Link } from "react-router";
import styles from "./Navbar.module.css";
import { useState, useRef } from "react";

const Navbar = () => {
  const magnetoRef = useRef<HTMLDivElement>(null);

  const [outerPos, setOuterPos] = useState({ x: 0, y: 0 });
  const [textPos, setTextPos] = useState({ x: 0, y: 0 });

  function activateMagneto(e: React.MouseEvent<HTMLDivElement>) {
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
    <>
      <div className={styles["navbar"]}>
        <div className={`${styles["nav_element"]} ml-3 mt-3`}>
          <Link to={"/"} className={`${styles["nav_link2"]} text-5xl `}>
            IncorpFirm
          </Link>
        </div>
        <div className={`${styles["nav_right"]} text-lg`}>
          <div className={styles["nav_element"]}>
            <Link to={"/incorporate"} className={styles["nav_link"]}>
              Incorporate
            </Link>
          </div>

          <div
            className={`${styles.nav_element} ${styles.magneto} cursor-pointer`}
            ref={magnetoRef}
            style={{
              transform: `translate(${outerPos.x}px, ${outerPos.y}px)`,
            }}
            onMouseMove={activateMagneto}
            onMouseLeave={resetMagneto}
          >
            <Link
              to="/admin"
              className={`${styles.nav_link2} ${styles["magneto-text"]}`}
              style={{
                transform: `translate(${textPos.x}px, ${textPos.y}px)`,
              }}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
