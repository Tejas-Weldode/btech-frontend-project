import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Home.css";

import CommentCard from "../components/CommentCard.jsx";

import { useAuthContext } from "../context/authContext.jsx";

function Home() {
    const { accessToken } = useAuthContext();
    const navigate = useNavigate();

    const [comments, setComments] = useState([]);
    const [data, setData] = useState(null);
    const [videoId, setVideoId] = useState("");
    const [averageQuality, setAverageQuality] = useState(null); // State to store average quality

    const getComments = async (videoId) => {
        try {
            console.log("getComments running");
            const response = await axios.get(
                `https://www.googleapis.com/youtube/v3/commentThreads`,
                {
                    params: {
                        part: "snippet",
                        videoId: videoId,
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
            // Calculate average quality after getting the rated comments
            const qualityRatings = response.data.map(
                (comment) => comment.quality
            );
            const average =
                qualityRatings.reduce((acc, rating) => acc + rating, 0) /
                qualityRatings.length;
            setAverageQuality(average.toFixed(2)); // Set average with 2 decimal places
        } catch (error) {
            console.error("Error in getRatedComments", error);
        }
    };

    const extractVideoId = (url) => {
        const match = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
        return match ? match[1] : null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form from refreshing the page
        const extractedVideoId = extractVideoId(videoId); // Extract video ID from URL
        if (extractedVideoId) {
            await getComments(extractedVideoId); // Fetch comments for the extracted videoId
        } else {
            alert("Invalid YouTube URL");
        }
    };

    useEffect(() => {
        if (comments.length > 0) {
            getRatedComments(); // Fetch rated comments after comments state is updated
        }
    }, [comments]); // Run this effect when comments state changes

    return (
        <div className="container home-container">
            <h1>Analyze Video</h1>

            <form onSubmit={handleSubmit}>
                <label className="text-bold">
                    Enter YouTube Video ID:
                    <input
                        type="text"
                        value={videoId}
                        onChange={(e) => setVideoId(e.target.value)}
                        placeholder="Enter video ID"
                    />
                </label>
                <button type="submit">Fetch Comments</button>
            </form>

            {/* Display average quality rating before the comments */}
            {averageQuality !== null && (
                <div className="average-quality">
                    <h2>Average Quality Rating: {averageQuality} / 5</h2>
                </div>
            )}

            <div className="comment-section">
                {data && data.data ? (
                    data.data.map((comment, index) => (
                        <CommentCard key={index} comment={comment} />
                    ))
                ) : (
                    <p className="no-comments">No comments to display</p>
                )}
            </div>

            {/* {data ? <pre>{JSON.stringify(data.data, null, 2)}</pre> : ""} */}
        </div>
    );
}

export default Home;
