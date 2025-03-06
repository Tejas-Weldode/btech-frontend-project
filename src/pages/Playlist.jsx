// src/pages/Playlist.jsx
import React, { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../context/authContext.jsx";
import CommentCard from "../components/CommentCard";
import StarRating from "../components/StarRating"; // Import the StarRating component
import "./Playlist.css";

function Playlist() {
    const { accessToken } = useAuthContext();
    const [playlistLink, setPlaylistLink] = useState("");
    const [videoData, setVideoData] = useState([]);

    // Extract Playlist ID from URL
    const extractPlaylistId = (url) => {
        const match = url.match(/[?&]list=([^&]+)/);
        return match ? match[1] : null;
    };

    // Fetch videos from the playlist
    const fetchPlaylistVideos = async () => {
        const playlistId = extractPlaylistId(playlistLink);
        if (!playlistId) return alert("Invalid playlist URL");

        try {
            const response = await axios.get(
                "https://www.googleapis.com/youtube/v3/playlistItems",
                {
                    params: {
                        part: "snippet",
                        playlistId,
                        maxResults: 10, // Limit to 10 videos for now
                    },
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            const videos = response.data.items.map((item) => ({
                videoId: item.snippet.resourceId.videoId,
                title: item.snippet.title,
                thumbnail: item.snippet.thumbnails.medium.url,
            }));

            fetchVideoComments(videos);
        } catch (error) {
            console.error("Error fetching playlist videos", error);
        }
    };

    // Fetch comments for each video
    const fetchVideoComments = async (videos) => {
        let fetchedData = [];

        for (let video of videos) {
            try {
                const commentsResponse = await axios.get(
                    "https://www.googleapis.com/youtube/v3/commentThreads",
                    {
                        params: {
                            part: "snippet",
                            videoId: video.videoId,
                            maxResults: 10,
                        },
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                // Send comments to backend for sentiment analysis
                const ratedComments = await axios.post(
                    "http://127.0.0.1:5000/predict",
                    commentsResponse.data.items
                );

                console.log(ratedComments.data);

                // Calculate average quality for the comments
                const averageQuality = ratedComments.data.reduce(
                    (acc, comment) => acc + comment.quality,
                    0
                );
                const averageQualityRating =
                    ratedComments.data.length > 0
                        ? averageQuality / ratedComments.data.length
                        : 0; // Prevent division by zero

                // Calculate average difficulty for the comments
                const averageDifficulty = ratedComments.data.reduce(
                    (acc, comment) => acc + comment.difficulty,
                    0
                );
                const averageDifficultyRating =
                    ratedComments.data.length > 0
                        ? averageDifficulty / ratedComments.data.length
                        : 0; // Prevent division by zero

                console.log(ratedComments.data);

                fetchedData.push({
                    ...video,
                    comments: ratedComments.data || [],
                    averageQualityRating: averageQualityRating.toFixed(2), // Store the average rating
                    averageDifficultyRating: averageDifficultyRating.toFixed(2), // Store the average rating
                });
            } catch (error) {
                console.error(
                    `Error fetching comments for ${video.videoId}`,
                    error
                );
            }
        }

        setVideoData(fetchedData);
    };

    return (
        <div className="container playlist-container">
            <div className="main-container">
                <h1>Analyze YouTube Playlist</h1>

                <input
                    type="text"
                    value={playlistLink}
                    onChange={(e) => setPlaylistLink(e.target.value)}
                    placeholder="Enter YouTube playlist link"
                />
                <button
                    onClick={fetchPlaylistVideos}
                    className="analyze-button"
                >
                    Analyze Playlist
                </button>
            </div>

            <div className="results-container">
                {videoData.length > 0 &&
                    videoData.map((video) => (
                        <div key={video.videoId} className="video-column">
                            <img src={video.thumbnail} alt="Thumbnail" />
                            <h3>{video.title}</h3>

                            {/* Display Star Rating for the video */}
                            <div className="star-rating">
                                <StarRating
                                    heading={"Quality"}
                                    rating={video.averageQualityRating}
                                />
                            </div>

                            {/* Display Star Rating for the video */}
                            <div className="star-rating">
                                <StarRating
                                    heading={"Difficulty"}
                                    rating={video.averageDifficultyRating}
                                />
                            </div>

                            {/* <div className="comments">
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
                            </div> */}
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default Playlist;
