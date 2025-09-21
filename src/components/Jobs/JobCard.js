const JobCard = ({ job, onDelete }) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5>{job.title}</h5>
        <p>{job.location}</p>
        <p>{job.description}</p>
        <button
          className="btn btn-danger"
          onClick={() => onDelete(job.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobCard;
