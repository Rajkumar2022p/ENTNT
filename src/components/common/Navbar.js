import React from "react";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg px-3 navbar-background">

      <div className="container-fluid">
      <a className="navbar-brand" href="#">
  <img
    src="/Mylogo.png"
    alt="Logo"
    width="120"
    height="60"
    className="d-inline-block align-text-top rounded"
  />
</a>

    <div className="d-flex align-items-center ms-4 gap-3">
  <button className="nav-btn-custom">Jobs</button>
  <button className="nav-btn-custom">Candidates</button>
  <button className="nav-btn-custom">Assessments</button>
</div>




          {/* Search Form */}
          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
        </div>
     
    </nav>
  );
};



export default Navbar;
