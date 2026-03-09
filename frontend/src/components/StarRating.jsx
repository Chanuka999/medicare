import React from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import "../styles/StarRating.css";

const StarRating = ({
  rating,
  onRatingChange,
  readonly = false,
  size = 20,
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const handleClick = (index) => {
    if (!readonly && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  const handleMouseEnter = (index) => {
    if (!readonly) {
      setHoverRating(index + 1);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating || 0;

  const renderStar = (index) => {
    const filled = displayRating >= index + 1;
    const halfFilled = displayRating > index && displayRating < index + 1;

    return (
      <span
        key={index}
        className={`star ${readonly ? "readonly" : "interactive"}`}
        onClick={() => handleClick(index)}
        onMouseEnter={() => handleMouseEnter(index)}
        onMouseLeave={handleMouseLeave}
        style={{ fontSize: size }}
      >
        {filled ? (
          <FaStar className="star-filled" />
        ) : halfFilled ? (
          <FaStarHalfAlt className="star-half" />
        ) : (
          <FaRegStar className="star-empty" />
        )}
      </span>
    );
  };

  return (
    <div className="star-rating">
      {[0, 1, 2, 3, 4].map((index) => renderStar(index))}
      {readonly && rating > 0 && (
        <span className="rating-text">({rating.toFixed(1)})</span>
      )}
    </div>
  );
};

export default StarRating;
