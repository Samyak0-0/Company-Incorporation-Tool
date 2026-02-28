import { Link } from "react-router";
import "./Homepage.css";
import incorporate from "../assets/images/incorporate.jpg";
import { FaArrowRight } from "react-icons/fa";
import { FaQuoteLeft } from "react-icons/fa";
import { FaQuoteRight } from "react-icons/fa";
import { useState, useRef } from "react";

function Homepage() {
  const magnetoRef = useRef(null);

  const [outerPos, setOuterPos] = useState({ x: 0, y: 0 });
  const [textPos, setTextPos] = useState({ x: 0, y: 0 });

  function activateMagneto(e) {
    const magneto = magnetoRef.current;
    const boundBox = magneto.getBoundingClientRect();

    const newX = (e.clientX - boundBox.left) / magneto.offsetWidth - 0.5;
    const newY = (e.clientY - boundBox.top) / magneto.offsetHeight - 0.5;

    // Outer container moves less
    setOuterPos({
      x: newX * 20,
      y: newY * 20,
    });

    // Text moves more (stronger magnetic effect)
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
    <div className="homepage">
      <div className="word-content ml-8 ">
        <div className="text-6xl mb-8">IncorpForm</div>
        <div className="subtext italic text-lg mb-8">
          <FaQuoteLeft className="inline align-middle mr-3" />
          Incorporate your Company or Business Online within 10mins. <br />
          Ease the Hassle and Simplify the Traditional Company Incorporation
          Process.
          <FaQuoteRight className="inline align-middle ml-3" />
        </div>
        <div>
          <Link to={"/incorporate"}>
            <div
              className="call-to-action magneto flex cursor-pointer  items-center p-4"
              ref={magnetoRef}
              style={{
                transform: `translate(${outerPos.x}px, ${outerPos.y}px)`,
              }}
              onMouseMove={activateMagneto}
              onMouseLeave={resetMagneto}
            >
              <span
                className="magneto-text"
                style={{
                  transform: `translate(${textPos.x}px, ${textPos.y}px)`,
                }}
              >
                Incorporate Now
              </span>{" "}
              <FaArrowRight
                className=" magneto-text ml-4"
                style={{
                  transform: `translate(${textPos.x}px, ${textPos.y}px)`,
                }}
              />
            </div>
          </Link>
        </div>
      </div>
      <div className="diamond-box">
        <img src={incorporate} alt="company-people-working" />
      </div>
    </div>
  );
}

export default Homepage;
