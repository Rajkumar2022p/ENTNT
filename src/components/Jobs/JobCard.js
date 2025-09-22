import { useNavigate } from 'react-router-dom';

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5>{job.title}</h5>
        <p>{job.location}</p>
        <p>{job.description}</p>

        <button
          className="btn btn-primary"
          onClick={() => navigate('/assessments', { state: { job } })}
        >
          Assign Assessment
        </button>
      </div>
    </div>
  );
};

export default JobCard;