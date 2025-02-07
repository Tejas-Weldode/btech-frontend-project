import React from "react";
import "./StarRating.css"; // We will define the CSS here for styling

function StarRating({ rating }) {
    // Ensure the rating is a number and between 0 and 5
    const validRating = Math.max(0, Math.min(5, rating));

    // Function to render the stars based on the rating
    const renderStars = (rating) => {
        const filledStars = Math.floor(rating); // Filled stars (whole)
        const halfStar = rating % 1 !== 0; // Half-filled star condition
        const emptyStars = 5 - filledStars - (halfStar ? 1 : 0); // Empty stars

        return (
            <>
                <div>Average Quality Rating</div>
                <div>{rating}/5</div>
                <div className="stars">
                    {[...Array(filledStars)].map((_, index) => (
                        <span key={`filled-${index}`} className="star filled">
                            ★
                        </span>
                    ))}
                    {halfStar && <span className="star half">★</span>}
                    {[...Array(emptyStars)].map((_, index) => (
                        <span key={`empty-${index}`} className="star empty">
                            ★
                        </span>
                    ))}
                </div>
            </>
        );
    };

    return <div className="star-rating">{renderStars(validRating)}</div>;
}

export default StarRating;
