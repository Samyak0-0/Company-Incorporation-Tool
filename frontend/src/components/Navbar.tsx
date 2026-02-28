import { Link } from "react-router";
import "./Navbar.css";

const Navbar = () => {
  return (
    <>
      <div className="navbar">
        <div className="nav_element">
          <Link to={"/"} className="nav_link">
            IncorpForm
          </Link>
        </div>
        <div className="nav_right">
          <div className="nav_element">
            <Link to={"/incorporate"} className="nav_link">
              Incorporate
            </Link>
          </div>
          <div className="nav_element">
            <Link to={"/admin"} className="nav_link">
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
