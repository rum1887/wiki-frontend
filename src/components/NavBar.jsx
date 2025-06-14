import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
    return (
        <nav className="navbar">
            <Link to="/home" className="nav-brand">Wikipedia Article Tagging</Link>
            <div className="nav-menu">
                <Link to="/home" className="nav-item">Home</Link>
                <Link to="/bookmarked" className="nav-item">Bookmarked Articles</Link>
                <Link to="/profile" className="nav-item">User Profile</Link>
            </div>
        </nav>
    );
};

export default NavBar;