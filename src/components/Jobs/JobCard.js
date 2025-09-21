import React from "react";

const JobCard = ({ title, location, description }) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{location}</h6>
        <p className="card-text">{description}</p>
      </div>
    </div>
  );
};

export default JobCard;
