// src/components/CommentCard.jsx
import React from "react";

const CommentCard = ({ comment }) => {
    return (
        <div className="card">
            <h3>{comment.snippet.topLevelComment.snippet.authorDisplayName}</h3>
            <p>{comment.snippet.topLevelComment.snippet.textOriginal}</p>

            <p>Likes: {comment.snippet.topLevelComment.snippet.likeCount}</p>
            {/* <p>Difficulty: {comment.difficulty}</p> */}
            <p>Quality: {comment.quality}</p>
        </div>
    );
};

export default CommentCard;
