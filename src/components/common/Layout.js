// src/components/common/Layout.js
import React, { useState } from 'react';
import Loader from './Loader';

const Layout = ({ children }) => {
  const [loading, setLoading] = useState(false);

  // Expose a setter for artificial latency
  const startLoading = (duration = 2000, callback) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (callback) callback();
    }, duration);
  };

  return (
    <>
      <Loader loading={loading} />
      {React.cloneElement(children, { startLoading })}
    </>
  );
};

export default Layout;
