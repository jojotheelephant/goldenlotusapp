import React from "react";

// // Typechecks our props. Typecheck at the bottom of page
// import PropTypes from "prop-types";

const Rating = ({ rating, reviews, color }) => {
    return (
        <div className="rating">
            <span>
                <i
                    style={{ color: color }}
                    className={
                        rating >= 1
                            ? "fas fa-star"
                            : rating >= 0.5
                            ? "fas fa-star-half-alt"
                            : "far fa-star"
                    }
                ></i>
            </span>
            <span>
                <i
                    style={{ color: color }}
                    className={
                        rating >= 2
                            ? "fas fa-star"
                            : rating >= 1.5
                            ? "fas fa-star-half-alt"
                            : "far fa-star"
                    }
                ></i>
            </span>
            <span>
                <i
                    style={{ color: color }}
                    className={
                        rating >= 3
                            ? "fas fa-star"
                            : rating >= 2.5
                            ? "fas fa-star-half-alt"
                            : "far fa-star"
                    }
                ></i>
            </span>
            <span>
                <i
                    style={{ color: color }}
                    className={
                        rating >= 4
                            ? "fas fa-star"
                            : rating >= 3.5
                            ? "fas fa-star-half-alt"
                            : "far fa-star"
                    }
                ></i>
            </span>
            <span>
                <i
                    style={{ color: color }}
                    className={
                        rating >= 5
                            ? "fas fa-star"
                            : rating >= 4.5
                            ? "fas fa-star-half-alt"
                            : "far fa-star"
                    }
                ></i>
            </span>
            <span>{reviews && reviews}</span>
        </div>
    );
};

Rating.defaultProps = {
    color: "#f8e825",
};

// Rating.propTypes = {
//     rating: PropTypes.number.isRequired,
//     reivews: PropTypes.string,
//     color: PropTypes.string,
// };

export default Rating;
