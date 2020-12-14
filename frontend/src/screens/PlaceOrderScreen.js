import React, { useEffect } from "react";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../Components/Message.js";
import CheckoutSteps from "../Components/CheckoutSteps.js";
import { createOrder } from "../actions/orderActions";
import LoginRedirect from "../Components/LoginRedirect.js";

const PlaceOrderScreen = ({ location, history }) => {
    // redux
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);

    // redirects to login -> cart if user is not logged in
    LoginRedirect(location, history);

    // formats the numbers to two decimals places
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    // calculate prices
    cart.itemsPrice = addDecimals(
        cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );

    // shipping price: free if order > $100
    cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 10);
    // tax price
    cart.taxPrice = addDecimals(Number(cart.itemsPrice) * 0.0825);
    // add total price
    cart.totalPrice = addDecimals(
        Number(cart.itemsPrice) +
            Number(cart.shippingPrice) +
            Number(cart.taxPrice)
    );

    // create Order
    const orderCreate = useSelector((state) => state.orderCreate);
    const { order, success, error } = orderCreate;

    useEffect(() => {
        if (success) {
            history.push(`/order/${order._id}`);
        }
        // eslint-disable-next-line
    }, [history, success]);

    const placeOrderHandler = (e) => {
        e.preventDefault();
        dispatch(
            createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            })
        );
    };

    // continue shopping go back to last page.
    const continueShoppingHandler = () => {
        history.push("/");
    };

    return (
        <>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                <Col md={8}>
                    <ListGroup variant="flush">
                        {/* shipping address */}
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            {cart.shippingAddress.address ? (
                                <>
                                    <p>{cart.shippingAddress.address}</p>
                                    <p>
                                        {cart.shippingAddress.city}{" "}
                                        {cart.shippingAddress.postalCode}
                                        {", "}
                                        {cart.shippingAddress.state}{" "}
                                        {cart.shippingAddress.country}
                                    </p>
                                </>
                            ) : (
                                <p>add shipping address</p>
                            )}

                            {/* edit shipping details redirect  */}
                            <Link
                                type="button"
                                variant="light"
                                onClick={() => history.push("/shipping")}
                            >
                                <i className="fas fa-edit"></i>
                            </Link>
                        </ListGroup.Item>

                        {/* payment method */}
                        <ListGroup.Item>
                            <h2>Payment</h2>
                            {cart.paymentMethod ? (
                                <p>{cart.paymentMethod}</p>
                            ) : (
                                <p>add payment method</p>
                            )}
                            {/* edit payment method redirect */}
                            <Link
                                type="button"
                                variant="light"
                                onClick={() => history.push("/payment")}
                            >
                                <i className="fas fa-edit"></i>
                            </Link>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {cart.cartItems.length === 0 ? (
                                <Message>Your cart is empty</Message>
                            ) : (
                                <ListGroup variant="flush">
                                    {cart.cartItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={2}>
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fluid
                                                        rounded
                                                    />
                                                </Col>
                                                <Col>
                                                    <Link
                                                        to={`/product/${item.product}`}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x ${item.price} =
                                                    ${item.qty * item.price}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col md={4}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col>${cart.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>${cart.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>${cart.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>${cart.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                {error && (
                                    <Message variant="danger">{error}</Message>
                                )}
                            </ListGroup.Item>

                            {/* continue shopping button */}
                            <ListGroup.Item>
                                <Button
                                    type="button"
                                    className="btn-block"
                                    variant="outline-dark"
                                    onClick={continueShoppingHandler}
                                >
                                    Continue Shopping
                                </Button>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button
                                    type="button"
                                    className="btn-block"
                                    disabled={
                                        cart.cartItems === 0 ||
                                        !cart.shippingAddress ||
                                        !cart.paymentMethod
                                    }
                                    onClick={placeOrderHandler}
                                >
                                    Place Order
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default PlaceOrderScreen;
