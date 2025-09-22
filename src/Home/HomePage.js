import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import './HomePage.css';

// Stars Animation Component
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

// Typing animation loop
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

const HomePage = ({ onJobLogin, onCandidateLogin }) => {
  const navigate = useNavigate(); // ← Add useNavigate here
  const messages = ['Welcome to TalentFlow', 'Hire Good Developers', 'Manage Candidates Easily'];

  return (
    <div className="homepage-container">
      {/* 3D Stars */}
      <Canvas className="canvas-bg" camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <AnimatedStars />
      </Canvas>

      {/* Overlay */}
      <div className="overlay-ui">
        <TypedLoop messages={messages} />
        <div className="cards-container-vertical">
          <div className="login-card job-card">
            <h2>Job / Recruiter Login</h2>
            <p>Access the job dashboard, create assignments, and manage candidates.</p>
            <button
              className="card-button"
              onClick={() => {
                onJobLogin();       // keep role state update
                navigate('/login'); // navigate to Job Login page
              }}
            >
              Go <span className="arrow">→</span>
            </button>
          </div>
          <div className="login-card candidate-card">
            <h2>Candidate Login</h2>
            <p>View assignments, submit answers, and track your progress.</p>
            <button
              className="card-button"
              onClick={() => {
                onCandidateLogin();  // keep role state update
                navigate('/login');  // navigate to Candidate Login page
              }}
            >
              Go <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
