import { useContext } from "react";
import { AuthContext } from '../contexts/AuthContext.jsx';
import NavBar from "./NavBar.jsx";

const UserProfile = () => {
    const { user, logout } = useContext(AuthContext);
    
    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-page">
            <NavBar />
            <div className="profile-container">
                <div className="profile-header">
                    <h2>User Profile</h2>
                </div>
                <div className="profile-info">
                    <p>
                        <strong>Username:</strong>
                        {user.username}
                    </p>
                    <p>
                        <strong>Email:</strong>
                        {user.email}
                    </p>
                </div>
                <button onClick={logout} className="logout-button">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default UserProfile;