// src/components/common/Layout.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';
import Navbar from './Navbar'; // ✅ import Navbar

const Layout = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const startLoading = (path) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(path);
    }, 1500);
  };

  return (
    <>
      <Loader loading={loading} />
      <Navbar /> {/* ✅ Always show Navbar */}
      {/* Pass startLoading to child pages */}
      {React.cloneElement(children, { startLoading })}
    </>
  );
};

export default Layout;
