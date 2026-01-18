import React from 'react'
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedUserRoute = ({children}) => {
  const auth = useSelector((state) => state.auth);

  if (auth.loading) {
    return <p>Loading...</p>;
  }

  if (!auth.user) {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
    {children}
    </>
  )
}

export default ProtectedUserRoute
