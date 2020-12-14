import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../Components/Message";
import Loader from "../Components/Loader";
import { getUserDetails, updateUserProfile } from "../actions/userActions.js";
import { USER_UPDATE_PROFILE_RESET } from "../constants/userConstants.js";
import { listMyOrder } from "../actions/orderActions";

const ProfileScreen = ({ location, history }) => {
    // useState
    const [profileName, setProfileName] = useState("");
    const [profileEmail, setProfileEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [edit, setEdit] = useState(false);

    // useDispatch declaration
    const dispatch = useDispatch();

    // useSelector
    const userDetails = useSelector((state) => state.userDetails);
    const { loading, error, user } = userDetails;
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
    const { success } = userUpdateProfile;
    const orderListMy = useSelector((state) => state.orderListMy);
    const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;

    // useEffect
    useEffect(() => {
        if (!userInfo) {
            history.push("/login");
        } else {
            if (!user.name || success) {
                dispatch({ type: USER_UPDATE_PROFILE_RESET });
                dispatch(getUserDetails("profile"));
                dispatch(listMyOrder());
            } else {
                setProfileName(user.name);
                setProfileEmail(user.email);
            }
        }
    }, [history, userInfo, dispatch, user, success]);

    // submit handlers
    const submitHandler = (e) => {
        e.preventDefault();
        setEdit(false);
        if (password !== confirmPassword) {
            setMessage("password do not match");
        } else {
            dispatch(
                updateUserProfile({
                    id: user._id,
                    name: profileName,
                    email: profileEmail,
                    password,
                })
            );
        }
    };

    return (
        <Row>
            <Col md={3}>
                <h2>User Profile</h2>
                {message && <Message variant="danger">{message}</Message>}
                {error && <Message variant="danger">{error}</Message>}
                {success && (
                    <Message variant="success">Profile Updated</Message>
                )}
                {loading && <Loader />}

                {/* allows for toggle between edit and view only for profile */}
                {edit ? (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId="profilename">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="name"
                                placeholder="Enter full name"
                                value={profileName}
                                onChange={(e) => setProfileName(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="profileemail">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={profileEmail}
                                onChange={(e) =>
                                    setProfileEmail(e.target.value)
                                }
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="profilepassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="profileconfirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            ></Form.Control>
                        </Form.Group>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setEdit(false)}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" variant="dark">
                            Update
                        </Button>
                    </Form>
                ) : (
                    <>
                        <p>
                            Full Name: <br />
                            {profileName}
                            <br />
                            <br />
                            Email:
                            <br />
                            {profileEmail}
                            <br />
                            <br />
                        </p>
                        <Button
                            type="button"
                            variant="primary"
                            onClick={() => setEdit(true)}
                        >
                            Edit
                        </Button>
                    </>
                )}
            </Col>

            {/* My orders */}
            <Col md={9}>
                <h2>My Orders</h2>
                {loadingOrders ? (
                    <Loader />
                ) : errorOrders ? (
                    <Message variant="danger">{errorOrders}</Message>
                ) : (
                    <Table
                        striped
                        bordered
                        hover
                        responsive
                        className="table-sm"
                    >
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>PAID</th>
                                <th>DELIVERED</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt.substring(0, 10)}</td>
                                    <td>{order.totalPrice}</td>
                                    <td>
                                        {order.isPaid ? (
                                            order.paidAt.substring(0, 10)
                                        ) : (
                                            <i
                                                className="fas fa-times"
                                                style={{ color: "red" }}
                                            ></i>
                                        )}
                                    </td>
                                    <td>
                                        {order.isDelivered ? (
                                            order.deliveredAt.substring(0, 10)
                                        ) : (
                                            <i
                                                className="fas fa-times"
                                                style={{ color: "red" }}
                                            ></i>
                                        )}
                                    </td>
                                    <td>
                                        <LinkContainer
                                            to={`/orders/${order._id}`}
                                        >
                                            <Button
                                                className="btn-sm"
                                                variant="light"
                                            >
                                                Details
                                            </Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Col>
        </Row>
    );
};

export default ProfileScreen;
