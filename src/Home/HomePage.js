// src/components/Home/HomePage.js
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import './HomePage.css';

const AnimatedStars = () => {
  const starsRef = useRef();
  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0005;
      starsRef.current.rotation.x += 0.0003;
    }
  });
  return (
    <group ref={starsRef}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
    </group>
  );
};

const TypedLoop = ({ messages, speed = 100, delay = 1500 }) => {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let i = 0;
    const type = () => {
      if (i < messages[index].length) {
        setDisplayed(messages[index].slice(0, i + 1));
        i++;
        setTimeout(type, speed);
      } else {
        setTimeout(() => {
          setDisplayed('');
          setIndex((prev) => (prev + 1) % messages.length);
        }, delay);
      }
    };
    type();
  }, [index, messages, speed, delay]);

  return <h1 className="typed-title">{displayed}</h1>;
};

const HomePage = () => {
  const messages = ['Welcome to TalentFlow', 'Hire Good Developers', 'Manage Candidates Easily'];
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      <Canvas className="canvas-bg" camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <AnimatedStars />
      </Canvas>

      <div className="overlay-ui">
        <TypedLoop messages={messages} />
        <div className="cards-container-vertical">
          {/* Job / Recruiter Card */}
          <div className="login-card job-card">
            <h2>Job / Recruiter</h2>
            <p>Access the job dashboard, create assignments, and manage candidates.</p>
            <button className="arrow-button" onClick={() => navigate('/JobLogin')}>
              ➜
            </button>
          </div>

          {/* Candidate Card */}
          <div className="login-card candidate-card">
            <h2>Candidate</h2>
            <p>View assignments, submit answers, and track your progress.</p>
            <button className="arrow-button" onClick={() => navigate('/CandidateLogin')}>
              ➜
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
