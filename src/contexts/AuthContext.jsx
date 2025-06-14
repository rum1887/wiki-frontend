import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, fetchUserProfile, registerUser } from '../Api';

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            const getUser = async () => {
                const user = await fetchUserProfile(token);
                setUser(user);
                setUserId(user.id);
            };
            getUser();
        }
    }, [token]);

    const login = async (username, password) => {
        const response = await loginUser({ username, password });
        if (response?.access_token) {
            setToken(response.access_token);
            localStorage.setItem('token', response.access_token);
            const userProfile = await fetchUserProfile(response.access_token);
            setUser(userProfile);
            setUserId(userProfile.id);
            navigate('/home');
        }
    };

    const register = async (username, email, password) => {
        await registerUser({ username, email, password });
        navigate('/login');
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setUserId(null); 
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ token, user, userId, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export {AuthProvider, AuthContext}