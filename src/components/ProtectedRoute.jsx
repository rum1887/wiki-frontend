import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
    const { token, user } = useContext(AuthContext); // Ensure both are valid
    console.log("Protected Route Check: ", { token, user });
    return token && user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;