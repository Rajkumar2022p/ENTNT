// src/components/common/Layout.js
import React, { useState, cloneElement } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';
import Navbar from './Navbar';

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

  // Only cloneElement if children is a valid React element
  const childWithProps =
    React.isValidElement(children)
      ? cloneElement(children, { startLoading })
      : children;

  return (
    <>
      <Loader loading={loading} />
      <Navbar />
      {childWithProps}
    </>
  );
};

export default Layout;
