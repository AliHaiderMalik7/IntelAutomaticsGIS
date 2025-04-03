import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface User {
  center_lat: number | null;
  center_long: number | null;
  email: string;
  first_name: string;
  last_name: string;
  id: number;
  is_superuser: boolean;
}

interface NavbarProps {
  user: User | null; 
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const filePath = '/data/vector_data.csv'
  
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
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
              <a href={filePath} download="vector_data.csv" className="nav-link black-light fw-bold">
                Download Data
              </a>
            </li>
            <li className="nav-item me-3">
              <span className="black-light fw-bold fs-8 ">Hey {user?.first_name} {user?.last_name} 👋</span>
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
