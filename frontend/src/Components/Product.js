import React from "react";
// import Link (stops reload of favicon) upon click. This is similar to <a> tag but specific for React-Router
import { Link } from "react-router-dom";
// import bootstrap 'Card'
import { Card } from "react-bootstrap";
import Rating from "./Rating";

// import Component

const Product = ({ product }) => {
    return (
        <Card className="my-3 p-3 rounded">
            <Link to={`/product/${product._id}`}>
                <Card.Img src={product.image} variant="top" />
            </Link>
            <Card.Body>
                <Link to={`/product/${product._id}`}>
                    <Card.Title as="div">
                        <strong>{product.name}</strong>{" "}
                    </Card.Title>
                </Link>

                <Card.Text as="div">
                    <Rating
                        rating={product.rating}
                        reviews={`${product.numReviews} reviews`}
                        color="#E5E600"
                    />
                </Card.Text>

                <Card.Text as="h3">${product.price}</Card.Text>
            </Card.Body>
        </Card>
    );
};

export default Product;
