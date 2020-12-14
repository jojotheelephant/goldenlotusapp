import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Row,
    Col,
    ListGroup,
    Image,
    Form,
    Button,
    Card,
} from "react-bootstrap";
import Message from "../Components/Message";
import { addToCart, removeFromCart } from "../actions/cartActions";
import CheckoutSteps from "../Components/CheckoutSteps";

const CartScreen = ({ match, location, history }) => {
    // productId and qty if routed from 'add to cart' from ProductScreen
    const productId = match.params.id;
    const qty = location.search ? Number(location.search.split("=")[1]) : 1;

    // redux
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    // runs action addToCart, which adds to state if routed from 'add to cart'
    useEffect(() => {
        if (productId) {
            dispatch(addToCart(productId, qty));
        }
    }, [dispatch, productId, qty]);

    // runs action removeFromCart to remove from state
    const removeFromCartHandler = (id) => dispatch(removeFromCart(id));

    // checkout -> continues to shipping page
    const checkoutHandler = () => {
        history.push("/login?redirect=shipping");
    };

    // continue shopping go back to last page.
    const continueShoppingHandler = () => {
        history.goBack();
    };

    return (
        <>
            <CheckoutSteps step1 />
            <Row>
                <Col md={8}>
                    <h1>Shopping Cart</h1>
                    {/* toggles between message and display items in cart */}
                    {cartItems.length === 0 ? (
                        <Message>
                            Your cart is empty <Link to="/">Go Back</Link>{" "}
                        </Message>
                    ) : (
                        // display items in cart
                        <ListGroup variant="flush">
                            {cartItems.map((item) => (
                                <ListGroup.Item key={item.product}>
                                    <Row>
                                        {/* cartItem image */}
                                        <Col md={2}>
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fluid
                                                rounded
                                            />
                                        </Col>
                                        {/* cartItem item name */}
                                        <Col me={3}>
                                            <Link
                                                to={`/product/${item.product}`}
                                            >
                                                {item.name}
                                            </Link>
                                        </Col>
                                        {/* cartItem price */}
                                        <Col md={2}>${item.price}</Col>
                                        {/* cartItem change qty  */}
                                        <Col md={2}>
                                            <Form.Control
                                                as="select"
                                                value={item.qty}
                                                onChange={(e) =>
                                                    dispatch(
                                                        addToCart(
                                                            item.product,
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    )
                                                }
                                            >
                                                {[
                                                    ...Array(
                                                        item.countInStock
                                                    ).keys(),
                                                ].map((x) => (
                                                    <option
                                                        key={x + 1}
                                                        value={x + 1}
                                                    >
                                                        {x + 1}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Col>
                                        {/* removeitem from cart trash button*/}
                                        <Col md={1}>
                                            <Button
                                                type="button"
                                                variant="light"
                                                onClick={() =>
                                                    removeFromCartHandler(
                                                        item.product
                                                    )
                                                }
                                            >
                                                <i className="fas fa-trash"></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Col>
                {/* subtotal/checkout/continue shopping card */}
                <Col md={4}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>
                                    Subtotal (
                                    {cartItems.reduce(
                                        (acc, item) => acc + item.qty,
                                        0
                                    )}
                                    ) items
                                </h2>
                                $
                                {cartItems
                                    .reduce(
                                        (acc, item) =>
                                            acc + item.qty * item.price,
                                        0
                                    )
                                    .toFixed(2)}
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
                            {/* checkout button */}
                            <ListGroup.Item>
                                <Button
                                    type="button"
                                    className="btn-block"
                                    disabled={cartItems.length === 0}
                                    onClick={checkoutHandler}
                                >
                                    Checkout
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default CartScreen;
