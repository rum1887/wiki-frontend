import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const { register } = useContext(AuthContext);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const { username, email, password } = formData;
        
        if (!username || !email || !password) {
            return "All fields are required.";
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return "Please enter a valid email address.";
        }
        
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!passwordRegex.test(password)) {
            return "Password must be at least 8 characters long and include numbers & letters.";
        }
        
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }
        try {
            await register(formData.username, formData.email, formData.password);
            navigate("/login");
        } catch (error) {
            setError(error.response?.data?.detail || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Choose a username"
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Create a password"
                        onChange={handleChange}
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="auth-button">Register</button>
            </form>
            <div className="auth-links">
                <p>Already have an account? <a href="/login">Login here</a></p>
            </div>
        </div>
    );
};

export default Register;

// import { useState, useContext } from "react";
// import { AuthContext } from "../contexts/AuthContext.jsx";
// import { useNavigate } from "react-router-dom";

// const Register = () => {
//     const [formData, setFormData] = useState({ username: "", email: "", password: "" });
//     const [error, setError] = useState("");
//     const navigate = useNavigate();
//     const { register } = useContext(AuthContext);

//     const handleChange = (e) => {
//         setFormData(prev => ({
//             ...prev,
//             [e.target.name]: e.target.value.trim()  
//         }));
//     };

//     const validateForm = () => {
//         const { username, email, password } = formData;

//         if (!username || !email || !password) {
//             return "All fields are required.";
//         }

//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//             return "Please enter a valid email address.";
//         }

//         const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;
//         if (!passwordRegex.test(password)) {
//             return "Password must be at least 8 characters long and include numbers & letters.";
//         }

//         return null;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const validationError = validateForm();
//         if (validationError) {
//             setError(validationError);
//             return;
//         }

//         try {
//             console.log("Sending registration request:", JSON.stringify(formData));
//             const response = await register(formData);
//             if (response?.success) {
//                 navigate("/login"); 
//             } else {
//                 setError(response?.message || "Registration failed. Try again.");
//             }
//         } catch (error) {
//             console.error("Registration error:", JSON.stringify(error.response?.data, null, 2));
//             setError(Array.isArray(error.response?.data?.detail) 
//                 ? error.response.data.detail.map(err => err.msg).join(", ") 
//                 : error.response?.data?.detail || "Something went wrong."
//             );
//         }
//     };

//     return (
//         <>
//             <h2>Register</h2>
//             <form onSubmit={handleSubmit}>
//                 <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
//                 <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
//                 <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
//                 <button type="submit">Register</button>
//             </form>
//             {error && <p className="error">{error}</p>}
//             <p>Already have an account? <a href="/login">Login here</a></p>
//         </>
//     );
// };

// export default Register;


