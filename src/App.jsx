import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {AuthProvider} from './contexts/AuthContext.jsx';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import UserProfile from './components/UserProfileCard.jsx';
import Home from './Pages/Home.jsx'
import Bookmarked from './Pages/SavedArticles.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import './App.css';

const App = () => {

    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/login" element={<Login/>}/>
                    
                    {/* Protected Routes */}
                    <Route path="/home" element={
                        <div className="app-container">
                            <ProtectedRoute><Home/></ProtectedRoute>
                        </div>
                    } />
                    <Route path="/bookmarked" element={
                        <div className="app-container">
                            <ProtectedRoute><Bookmarked/></ProtectedRoute>
                        </div>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <UserProfile/>
                        </ProtectedRoute>
                    }/>
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;

