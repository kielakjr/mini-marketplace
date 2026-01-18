import React from 'react'
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedAdminRoute = ({children}) => {
  const auth = useSelector((state) => state.auth);

  if (auth.loading) {
    return <p>Loading...</p>;
  }

  if (!auth.user || auth.user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }
  return (
    <>
    {children}
    </>
  )
}

export default ProtectedAdminRoute
