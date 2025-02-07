// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/authContext.jsx";
import "./Navbar.css"

function Navbar() {
    const navigate = useNavigate();
    const { accessToken } = useAuthContext();

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        navigate("/");
        alert("Access token removed!");
    };
    return (
        <nav className="navbar">
            <p>Educational Video Comments Analyzer</p>
            <ul className="nav-links">
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/compare">Compare</Link>
                </li>
                <li>
                    <Link to="/playlist">Playlist</Link>
                </li>
            </ul>
            {accessToken ? <button onClick={handleLogout}>Logout</button> : ""}
        </nav>
    );
}

export default Navbar;
