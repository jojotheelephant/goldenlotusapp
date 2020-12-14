import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../Components/FormContainer";
import { saveShippingAddress } from "../actions/cartActions.js";
import CheckoutSteps from "../Components/CheckoutSteps.js";
import LoginRedirect from "../Components/LoginRedirect";

const ShippingScreen = ({ location, history }) => {
    // redux
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    // useState
    const [address, setAddress] = useState(shippingAddress.address);
    const [city, setCity] = useState(shippingAddress.city);
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
    const [state, setState] = useState(shippingAddress.state);
    const [country, setCountry] = useState(shippingAddress.country);

    // redirects to login -> cart if user is not logged in
    LoginRedirect(location, history);

    // handlers
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(
            saveShippingAddress({ address, city, postalCode, state, country })
        );
        history.push("/payment");
    };

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 />
            <h1>Shipping</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter address"
                        value={address}
                        required
                        onChange={(e) => setAddress(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId="city">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter City"
                        value={city}
                        required
                        onChange={(e) => setCity(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId="state">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter State"
                        value={state}
                        required
                        onChange={(e) => setState(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId="postalCode">
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Postal Code"
                        value={postalCode}
                        required
                        onChange={(e) => setPostalCode(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId="country">
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Country"
                        value={country}
                        required
                        onChange={(e) => setCountry(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button onClick={submitHandler} variant="primary">
                    Continue
                </Button>
            </Form>
        </FormContainer>
    );
};

export default ShippingScreen;
