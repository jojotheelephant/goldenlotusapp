import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../Components/Message";
import Loader from "../Components/Loader";
import { listOrder } from "../actions/orderActions";
import {
    dateConversion,
    timeConversion,
    formatPrice,
} from "../functions/unitConversions";

const OrderListScreen = ({ history }) => {
    const dispatch = useDispatch();

    const orderList = useSelector((state) => state.orderList);
    const { loading, error, orders } = orderList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    //useEffect
    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listOrder());
        } else {
            history.push("/login");
        }
    }, [dispatch, userInfo, history]);

    return (
        <>
            <h1>Orders</h1>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <Table striped bordered hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>DATE (MM/DD/YYYY)</th>
                            <th>TIME (GMT)</th>
                            <th>TOTAL PRICE</th>
                            <th>ORDER ID</th>
                            <th>PAID</th>
                            <th>SHIPPED</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order.user && order.user.name}</td>
                                <td>{dateConversion(order.createdAt)}</td>
                                <td>{timeConversion(order.createdAt)}</td>
                                <td>$ {formatPrice(order.totalPrice)}</td>
                                <td>{order._id}</td>
                                <td>
                                    {order.isPaid ? (
                                        `${dateConversion(
                                            order.paidAt
                                        )} ${timeConversion(order.paidAt)}`
                                    ) : (
                                        <i
                                            className="fas fa-times"
                                            style={{ color: "red" }}
                                        ></i>
                                    )}
                                </td>
                                <td>
                                    {order.isDelivered ? (
                                        `${dateConversion(
                                            order.deliveredAt
                                        )} ${timeConversion(order.deliveredAt)}`
                                    ) : (
                                        <i
                                            className="fas fa-times"
                                            style={{ color: "red" }}
                                        ></i>
                                    )}
                                </td>
                                <td>
                                    <LinkContainer to={`/order/${order._id}`}>
                                        <Button
                                            variant="light"
                                            className="btn-sm"
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
        </>
    );
};

export default OrderListScreen;
