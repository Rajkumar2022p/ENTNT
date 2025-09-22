import React from "react";
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg px-3 navbar-background">
      <div className="container-fluid justify-content-between align-items-center">

        {/* Logo Image */}
        <a className="navbar-brand d-flex align-items-center" href="#">
          <img
            src="/Mylogo.png"       // <-- replace with your actual logo path
            alt="TalentFlow Logo"
            className="logo-image"
        

          />
        </a>

        {/* Search Form */}
        <form className="d-flex animated-search-form" role="search">
          <input
            className="form-control vibrant-input me-2"
            type="search"
            placeholder="Search Talent"
            aria-label="Search"
          />
          <button className="btn vibrant-btn" type="submit">
            Search
          </button>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
