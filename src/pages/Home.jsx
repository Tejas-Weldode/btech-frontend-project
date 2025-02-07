import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import comments from "../../comments.js";
import axios from "axios";

import { useAuthContext } from "../context/authContext.jsx";

function Home() {
    const { accessToken } = useAuthContext();
    const [comments, setComments] = useState([]);

    const navigate = useNavigate();
    const [data, setData] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        navigate("/");
        alert("Access token removed!");
    };

    const getComments = async () => {
        try {
            console.log("getComments running");
            // NOTE: wrote the params in a new style
            const response = await axios.get(
                `https://www.googleapis.com/youtube/v3/commentThreads`,
                {
                    params: {
                        part: "snippet",
                        videoId: "s4ET7Vn3nz4",
                        maxResults: 20,
                    },
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            setComments(response.data.items);
            console.log("getComments", response.data.items);
        } catch (error) {
            console.error("Error in getComments", error);
        }
    };

    const getRatedComments = async () => {
        try {
            console.log("getRatedComments running");
            const response = await axios.post(
                "http://127.0.0.1:5000/predict",
                comments
            );
            setData(response);
            console.log("getRatedComments", response);
        } catch (error) {
            console.error("Error in getRatedComments", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await getComments(); // Fetch comments first
        };
        fetchData();
    }, [accessToken]); // Run the effect when accessToken changes

    useEffect(() => {
        if (comments.length > 0) {
            getRatedComments(); // Fetch rated comments after comments state is updated
        }
    }, [comments]); // Run this effect when comments state changes

    return (
        <>
            <h1>Home</h1>
            <button onClick={handleLogout}>Logout</button>
            {data ? <pre>{JSON.stringify(data.data, null, 2)}</pre> : ""}
        </>
    );
}

export default Home;
