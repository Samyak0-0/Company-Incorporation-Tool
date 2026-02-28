import { Link } from "react-router";
import "./Homepage.css";
import incorporate from "../assets/images/incorporate.jpg";
import { FaArrowRight } from "react-icons/fa";
import { FaQuoteLeft } from "react-icons/fa";
import { FaQuoteRight } from "react-icons/fa";

function Homepage() {
  return (
    <div className="homepage">
      <div className="word-content ml-8 ">
        <div className="text-6xl mb-8">IncorpForm</div>
        <div className="italic text-lg mb-8">
          <FaQuoteLeft className="inline align-middle mr-3" />
          Incorporate your Company or Business Online within 10mins. <br />
          Ease the Hassle and Simplify the Traditional Company Incorporation
          Process.
          <FaQuoteRight className="inline align-middle ml-3" />
        </div>
        <div>
          <Link to={"/incorporate"}>
            <div className="call-to-action flex cursor-pointer  items-center p-6">
              Register Your Company Now <FaArrowRight className="ml-4" />
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
