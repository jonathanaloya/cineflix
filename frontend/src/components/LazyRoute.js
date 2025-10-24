import React, { Suspense } from 'react';

const LazyRoute = ({ children }) => {
  return (
    <Suspense fallback={
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    }>
      {children}
    </Suspense>
  );
};

export default LazyRoute;