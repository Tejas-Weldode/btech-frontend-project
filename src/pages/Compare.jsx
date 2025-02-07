// src/pages/Compare.jsx
import React, { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../context/authContext.jsx";
import CommentCard from "../components/CommentCard";
import "./Compare.css";
import StarRating from "../components/StarRating"; // Import the StarRating component

function Compare() {
    const { accessToken } = useAuthContext();
    const [videoLinks, setVideoLinks] = useState(["", ""]); // Start with 2 input fields
    const [videoData, setVideoData] = useState([]); // Store video details and comments

    // Function to extract video ID from a YouTube link
    const extractVideoId = (url) => {
        const match = url.match(/[?&]v=([^&]+)/);
        return match ? match[1] : null;
    };

    // Function to fetch video details (thumbnail, title) & comments
    const fetchVideoData = async () => {
        const videoIds = videoLinks.map(extractVideoId).filter(Boolean); // Extract valid video IDs
        let fetchedData = [];

        for (let videoId of videoIds) {
            try {
                // Fetch video details
                const videoResponse = await axios.get(
                    `https://www.googleapis.com/youtube/v3/videos`,
                    {
                        params: {
                            part: "snippet",
                            id: videoId,
                        },
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                // Fetch comments
                const commentsResponse = await axios.get(
                    `https://www.googleapis.com/youtube/v3/commentThreads`,
                    {
                        params: {
                            part: "snippet",
                            videoId,
                            maxResults: 10,
                        },
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                console.log(
                    "commentsResponse.data.items",
                    commentsResponse.data.items
                );

                // Get these comments rated
                const ratedComments = await axios.post(
                    "http://127.0.0.1:5000/predict",
                    commentsResponse.data.items
                );

                console.log("ratedComments", ratedComments);

                // Calculate the average quality rating for this video
                const qualityRatings = ratedComments.data.map(
                    (comment) => comment.quality
                );
                const averageQuality =
                    qualityRatings.reduce((acc, rating) => acc + rating, 0) /
                    qualityRatings.length;

                // Store video details and comments
                fetchedData.push({
                    videoId,
                    title:
                        videoResponse.data.items[0]?.snippet.title ||
                        "Unknown Title",
                    thumbnail:
                        videoResponse.data.items[0]?.snippet.thumbnails.medium
                            .url || "",
                    comments: ratedComments.data || [],
                    averageQuality: averageQuality.toFixed(2), // Store average quality
                });
            } catch (error) {
                console.error(
                    `Error fetching data for video ${videoId}`,
                    error
                );
            }
        }

        setVideoData(fetchedData);
    };

    // Handle adding new input field (max 4)
    const addInputField = () => {
        if (videoLinks.length < 4) {
            setVideoLinks([...videoLinks, ""]);
        }
    };

    // Handle input change
    const handleInputChange = (index, value) => {
        const updatedLinks = [...videoLinks];
        updatedLinks[index] = value;
        setVideoLinks(updatedLinks);
    };

    return (
        <div className="container compare-container">
            <h1>Compare Videos</h1>

            <div className="inputs-container">
                {videoLinks.map((link, index) => (
                    <input
                        key={index}
                        type="text"
                        value={link}
                        onChange={(e) =>
                            handleInputChange(index, e.target.value)
                        }
                        placeholder={`Enter YouTube link ${index + 1}`}
                    />
                ))}

                {videoLinks.length < 4 && (
                    <button onClick={addInputField} className="add-button">
                        +
                    </button>
                )}
                <button onClick={fetchVideoData} className="analyze-button">
                    Analyze
                </button>
            </div>

            <div className="results-container">
                {videoData.length > 0 &&
                    videoData.map((video) => (
                        <div key={video.videoId} className="video-column">
                            <img src={video.thumbnail} alt="Thumbnail" />
                            <h3>{video.title}</h3>

                            {/* Display the star rating based on the average quality */}
                            {video.averageQuality && (
                                <div className="average-quality">
                                    <StarRating
                                        rating={parseFloat(
                                            video.averageQuality
                                        )} // Pass average quality as rating
                                    />
                                </div>
                            )}

                            <div className="comments">
                                {video.comments.length > 0 ? (
                                    video.comments.map((comment, index) => (
                                        <CommentCard
                                            key={index}
                                            comment={comment}
                                        />
                                    ))
                                ) : (
                                    <p>No comments available</p>
                                )}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default Compare;
