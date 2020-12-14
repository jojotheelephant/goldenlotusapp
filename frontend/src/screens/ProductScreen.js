import React, { useState, useEffect } from "react";
// import Link for navigating through the site without reload
import { Link } from "react-router-dom";
// import bootstrap
import { Row, Col, Image, ListGroup, Card, Button, Form } from "react-bootstrap";
// import axios
import { useDispatch, useSelector } from "react-redux";
import { listProductDetails, createProductReview } from "../actions/productActions";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";
import { dateConversion } from "../functions/unitConversions";
import { ModalAlert } from "../Components/Modal";

// import components
import Rating from "../Components/Rating";
import Loader from "../Components/Loader";
import Message from "../Components/Message";
import Meta from "../Components/Meta";

const ProductScreen = ({ history, match }) => {
    // useState
    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const dispatch = useDispatch();

    // redux state
    const productDetails = useSelector((state) => state.productDetails);
    const { loading, error, product } = productDetails;

    const productCreateReview = useSelector((state) => state.productCreateReview);
    const { error: errorProductReview, success: successProductReview } = productCreateReview;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    // useEffect
    useEffect(() => {
        if (successProductReview) {
            setRating(0);
            setComment("");
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
        }
        dispatch(listProductDetails(match.params.id));
    }, [match, dispatch, successProductReview]);

    // set Modal states
    // Modal States
    const [show, setShow] = useState(false);
    const title = "Add a Review";
    const [body, setBody] = useState("");
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // handlers
    const addToCartHandler = () => {
        history.push(`/cart/${match.params.id}?qty=${qty}`);
    };

    const addReviewHandler = (event) => {
        event.preventDefault();
        if (!rating || rating === 0) {
            setBody("Select a rating");
            handleShow();
        } else if (!comment) {
            setBody("Don't forget to add a comment");
            handleShow();
        } else {
            dispatch(createProductReview(match.params.id, { rating, comment }));
        }
    };

    return (
        <div>
            <Meta title={`Golden Lotus - ${product.name}`} />
            <Link className="btn btn-light my-3" to="/">
                Go Back
            </Link>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger"> {error} </Message>
            ) : (
                <>
                    <Row>
                        {/* Product Image */}
                        <Col md={5}>
                            <Image src={product.image} alt={product.name} fluid />
                        </Col>
                        <Col md={4}>
                            {/* insert listgroup */}
                            <ListGroup variant="flush">
                                {/* Product Name */}
                                <ListGroup.Item>
                                    <h3>{product.name}</h3>
                                </ListGroup.Item>
                                {/* Product Rating */}
                                <ListGroup.Item>
                                    <Rating
                                        rating={product.rating}
                                        reviews={`${product.numReviews} reviews`}
                                    />
                                </ListGroup.Item>
                                {/* Product Price */}
                                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                                {/* Product Description */}
                                <ListGroup.Item>Description: {product.description}</ListGroup.Item>
                            </ListGroup>
                        </Col>
                        {/* Shopping Card */}
                        <Col md={3}>
                            <Card>
                                <ListGroup variant="flush">
                                    {/* Product Price */}
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Price:</Col>
                                            <Col>
                                                <strong>${product.price}</strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    {/* Product Status - in stock / out of stock */}
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Status:</Col>
                                            <Col>
                                                {product.countInStock > 0
                                                    ? "In Stock"
                                                    : "Out of Stock"}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    {/* Product Status - qty county */}
                                    {product.countInStock > 0 && (
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Qty</Col>
                                                <Col>
                                                    <Form.Control
                                                        as="select"
                                                        value={qty}
                                                        onChange={(e) => setQty(e.target.value)}
                                                    >
                                                        {[
                                                            ...Array(product.countInStock).keys(),
                                                        ].map((x) => (
                                                            <option key={x + 1} value={x + 1}>
                                                                {x + 1}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    )}
                                    {/* Add to cart Button - disabled if count in stock is <= 0 */}
                                    <ListGroup.Item>
                                        <Button
                                            onClick={addToCartHandler}
                                            className="btn-block"
                                            type="button"
                                            disabled={product.countInStock <= 0}
                                        >
                                            Add to Cart
                                        </Button>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <h2>Reviews</h2>
                            {product.reviews.length === 0 && <Message>No Reviews</Message>}
                            <ListGroup variant="flush">
                                {product.reviews.map((review) => (
                                    <ListGroup.Item key={review._id}>
                                        {review.name} - {dateConversion(review.createdAt)}
                                        <Rating rating={review.rating} />
                                        <p></p>
                                        <p>{review.comment}</p>
                                    </ListGroup.Item>
                                ))}
                                <ListGroup.Item>
                                    <h2>Add a Review</h2>
                                    {errorProductReview && (
                                        <Message variant="danger">{errorProductReview}</Message>
                                    )}
                                    {userInfo ? (
                                        <Form onSubmit={addReviewHandler}>
                                            <Form.Group id="rating">
                                                <Form.Label>Rating</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    value={rating}
                                                    onChange={(e) => setRating(e.target.value)}
                                                >
                                                    <option value="">Select...</option>
                                                    <option value="1">1 - Terrible</option>
                                                    <option value="2">2 - Poor</option>
                                                    <option value="3">3 - Fair</option>
                                                    <option value="4">4 - Good</option>
                                                    <option value="5">5 - Excellent</option>
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group id="comment">
                                                <Form.Label>Comment</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                ></Form.Control>
                                            </Form.Group>
                                            <Button type="submit" variant="primary">
                                                Add Review
                                            </Button>
                                            <ModalAlert
                                                show={show}
                                                onHide={handleClose}
                                                title={title}
                                                body={body}
                                                click={handleClose}
                                            />
                                        </Form>
                                    ) : (
                                        <Message>
                                            <Link to="/login">Sign In</Link> to leave a review
                                        </Message>
                                    )}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
};

export default ProductScreen;
