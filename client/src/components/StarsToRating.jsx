import { useState } from "react";

export const StarRatingInput = ({ rating, setRating }) => {
  const handleStarClick = (clickedIndex) => {
    // If the same star is clicked twice, reset the rating
    if (clickedIndex === rating) {
      setRating(0);
    } else {
      setRating(clickedIndex);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => handleStarClick(i)}
          className={
            i <= rating
              ? "text-yellow-400 cursor-pointer m-[2px] text-2xl"
              : "text-gray-300 cursor-pointer m-[2px] text-2xl"
          }
        >
          ★
        </span>
      );
    }
    return stars;
  };

  // Converts the selected star count to a float number (e.g., 3 stars = 3.0)
  const convertToFloatRating = () => {
    return parseFloat(rating).toFixed(1);
  };

  return (
    <div className="flex gap-2">
      <div className="mr-2">{renderStars()}</div>
      <span className="text-white text-2xl">
        Rating: {rating /* convertToFloatRating() */}
      </span>
    </div>
  );
};
