import { useState, useContext } from "react";
import { AuthContext } from '../contexts/AuthContext.jsx';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login, setUser } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.password) {
            setError("Username and password are required.");
            return;
        }

        try {
            const response = await login(formData.username, formData.password);
            if (response?.access_token) {
                localStorage.setItem("token", response.access_token);
                setUser({ username: formData.username });
                navigate("/home");
            } else {
                setError("Invalid credentials. Please try again.");
            }
        } catch (error) {
            setError(error.response?.data?.detail || "Login failed. Please try again.");
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Enter your username"
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        onChange={handleChange}
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="auth-button">Login</button>
            </form>
            <div className="auth-links">
                <p>Don't have an account? <a href="/register">Register here</a></p>
            </div>
        </div>
    );
};

export default Login;