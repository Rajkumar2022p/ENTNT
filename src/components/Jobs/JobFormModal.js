import React, { useState } from "react";

const JobFormModal = ({ onAddJob }) => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !location || !description) return;

    // Always pass as an array to avoid forEach errors
    const newJob = [{ id: Date.now(), title, location, description, status: "active" }];

    onAddJob(newJob);

    // Reset form
    setTitle("");
    setLocation("");
    setDescription("");
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-primary mb-3"
        data-bs-toggle="modal"
        data-bs-target="#jobModal"
      >
        + Add Job
      </button>

      <div className="modal fade" id="jobModal" tabIndex="-1" aria-labelledby="jobModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <form onSubmit={handleSubmit} className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="jobModalLabel">Add Job</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <input className="form-control mb-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <input className="form-control mb-2" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
              <textarea className="form-control" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" className="btn btn-primary">Add Job</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default JobFormModal;
