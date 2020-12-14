import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../Components/Message.js";
import Loader from "../Components/Loader.js";
import {
    getOrderDetails,
    payOrder,
    deliverOrder,
} from "../actions/orderActions";
import { PayPalButton } from "react-paypal-button-v2";
import {
    ORDER_PAY_RESET,
    ORDER_DELIVER_RESET,
} from "../constants/orderConstants";
import { dateConversion, timeConversion } from "../functions/unitConversions";

const OrderScreen = ({ match, history }) => {
    const orderId = match.params.id;

    const [sdkReady, setSdkReady] = useState(false);

    const dispatch = useDispatch();

    const orderDetails = useSelector((state) => state.orderDetails);
    const { order, loading, error } = orderDetails;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const orderPay = useSelector((state) => state.orderPay);
    const { loading: loadingPay, success: successPay } = orderPay;

    const orderDeliver = useSelector((state) => state.orderDeliver);
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

    // formats the numbers to two decimals places
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };
    if (!loading) {
        // calculate prices
        order.itemsPrice = addDecimals(
            order.orderItems.reduce(
                (acc, item) => acc + item.price * item.qty,
                0
            )
        );
    }

    useEffect(() => {
        if (!userInfo) {
            history.push("/login");
        }
        const addPayPalScript = async () => {
            const { data: clientId } = await axios.get("/api/config/paypal");
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
            script.async = true;
            script.onload = () => {
                setSdkReady(true);
            };
            document.body.appendChild(script);
        };

        if (!order || successPay || order._id !== orderId || successDeliver) {
            dispatch({ type: ORDER_PAY_RESET });
            dispatch({ type: ORDER_DELIVER_RESET });
            dispatch(getOrderDetails(orderId));
        } else if (!order.isPaid) {
            if (!window.paypal) {
                addPayPalScript();
            } else {
                setSdkReady(true);
            }
        }
    }, [dispatch, order, orderId, successPay, successDeliver]);

    // Paypal payment handler
    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(orderId, paymentResult));
    };

    const deliverHandler = () => {
        dispatch(deliverOrder(order));
    };

    return loading ? (
        <Loader />
    ) : error ? (
        <Message variant="danger">{error}</Message>
    ) : (
        <>
            <h1>Order {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant="flush">
                        {/* shipping address */}
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Name: {order.user.name}</strong>
                            </p>
                            <p>
                                <strong>Email: </strong>
                                <a href={`mailto:${order.user.email}`}>
                                    {order.user.email}
                                </a>
                            </p>
                            <p>
                                <strong>Address: </strong>
                                {order.shippingAddress.address}
                                {", "}
                                {order.shippingAddress.city}{" "}
                                {order.shippingAddress.postalCode}
                                {", "}
                                {order.shippingAddress.state}{" "}
                                {order.shippingAddress.country}
                            </p>
                            {loadingDeliver && <Loader />}
                            {order.isDelivered && order.deliveredAt ? (
                                <Message variant="success">
                                    Shipped on{" "}
                                    {dateConversion(order.deliveredAt)} at{" "}
                                    {timeConversion(order.deliveredAt)} UTC.
                                </Message>
                            ) : (
                                <Message variant="danger">Not Shipped</Message>
                            )}
                        </ListGroup.Item>

                        {/* payment method */}
                        <ListGroup.Item>
                            <h2>Payment</h2>
                            <p>
                                <strong>Method: </strong> {order.paymentMethod}{" "}
                            </p>
                            {order.isPaid ? (
                                <Message variant="success">
                                    Paid on {dateConversion(order.paidAt)} at{" "}
                                    {timeConversion(order.paidAt)} UTC.
                                </Message>
                            ) : (
                                <Message variant="danger">Not Paid</Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {order.orderItems.length === 0 ? (
                                <Message>Your order is empty</Message>
                            ) : (
                                <ListGroup variant="flush">
                                    {order.orderItems.map((item, index) => (
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
                                    <Col>
                                        $
                                        {order.itemsPrice
                                            ? addDecimals(order.itemsPrice)
                                            : ""}
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>
                                        $
                                        {order.shippingPrice
                                            ? addDecimals(order.shippingPrice)
                                            : "0.00"}
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>
                                        $
                                        {order.taxPrice
                                            ? addDecimals(order.taxPrice)
                                            : ""}
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>
                                        $
                                        {order.totalPrice
                                            ? addDecimals(order.totalPrice)
                                            : ""}
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {loadingPay && <Loader />}
                                    {!sdkReady ? (
                                        <Loader />
                                    ) : (
                                        <PayPalButton
                                            amount={order.totalPrice}
                                            onSuccess={successPaymentHandler}
                                        />
                                    )}
                                </ListGroup.Item>
                            )}

                            {userInfo &&
                                userInfo.isAdmin &&
                                order.isPaid &&
                                !order.isDelivered && (
                                    <ListGroup.Item>
                                        <Button
                                            type="button"
                                            className="btn btn-block"
                                            onClick={deliverHandler}
                                        >
                                            Mark as Shipped
                                        </Button>
                                    </ListGroup.Item>
                                )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default OrderScreen;
