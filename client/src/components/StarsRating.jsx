export const StarRating = ({ rating }) => {
  const renderStars = () => {
    const stars = [];
    const floorRating = Math.floor(rating);

    // Full stars
    for (let i = 0; i < floorRating; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">
          ★
        </span>
      );
    }

    /*     // Half star if rating is not an integer
    if (rating % 1 !== 0) {
      stars.push(
        <span key={stars.length} className="text-yellow-400">
          ★
        </span>
      );
    } */

    // Remaining empty stars
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <span key={stars.length} className="text-gray-300">
          ★
        </span>
      );
    }

    return stars;
  };

  return <div className="flex">{renderStars()}</div>;
};
