import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const userName = "Hey IntelAutomatics 👋";
const navigate = useNavigate();


const handleLogout = () => {
  localStorage.removeItem("token"); 
  navigate("/"); 
  window.location.reload()
};
  return (
    <nav
      className="navbar navbar-expand-md  shadow-sm px-4"
      style={{ background: "#00000014" }}>
      <div className="container-fluid">
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <img
            src="intellogo.png"
            alt="Logo"
            className="img-fluid"
            style={{ height: "50px" }}
          />
          <span className="ms-2 black-light fw-bold fs-4">IntelAutomatics</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto d-flex align-items-center">
            <li className="nav-item me-3">
              <span className="black-light fw-bold fs-8 ">{userName}</span>
            </li>
            <li className="nav-item">
              <button
                className="btn px-4 py-2 text-white fw-bold"
                style={{
                  background: "#059669",
                  border: "none",
                  borderRadius: "8px",
                }}
                onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
