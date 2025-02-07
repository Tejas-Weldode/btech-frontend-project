import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import comments from "../../comments.js";
import axios from "axios";

function Home() {
    const navigate = useNavigate();
    const [data, setData] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        navigate("/");
        alert("Access token removed!");
    };

    const getRatedComments = async () => {
        console.log("running");
        const response = await axios.post(
            "http://127.0.0.1:5000/predict",
            comments
        );
        setData(response);
        console.log(response);
    };

    useEffect(() => {
        getRatedComments();
    }, []);

    return (
        <>
            <h1>Home</h1>
            <button onClick={handleLogout}>Logout</button>
            {data ? <pre>{JSON.stringify(data.data, null, 2)}</pre> : ""}
        </>
    );
}

export default Home;
