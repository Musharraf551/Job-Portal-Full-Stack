import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/jobs/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        setJob(response.data);
      } catch (err) {
        setError("Failed to fetch job details.");
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    try {
      await axios.post(`http://localhost:8000/api/jobs/${id}/apply/`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      alert("Applied successfully!");
      navigate('/dashboard');
    } catch (err) {
      alert("You have already applied or are not allowed.");
    }
  };

  if (error) return <p>{error}</p>;
  if (!job) return <p>Loading...</p>;

  return (
    <div>
      <h2>{job.title}</h2>
      <p><strong>Company:</strong> {job.company}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Description:</strong> {job.description}</p>
      <p><strong>Salary:</strong> ₹{job.salary}</p>
      <button onClick={handleApply}>Apply Now</button>
    </div>
  );
};

export default JobDetail;
