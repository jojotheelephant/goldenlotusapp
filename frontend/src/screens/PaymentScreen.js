import React, { useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import FormContainer from "../Components/FormContainer";
import { savePaymentMethod } from "../actions/cartActions.js";
import CheckoutSteps from "../Components/CheckoutSteps.js";
import LoginRedirect from "../Components/LoginRedirect";

const PaymentScreen = ({ location, history }) => {
    // redux
    const dispatch = useDispatch();

    // redirect login
    LoginRedirect(location, history);

    // useState
    const [paymentMethod, setPaymentMethod] = useState("PayPal");

    // handlers
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        history.push("/placeorder");
    };

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />
            <h1>Payment Method</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as="legend">Select Method:</Form.Label>

                    <Col>
                        <Form.Check
                            type="radio"
                            label="PayPal or Credit Card"
                            id="PayPal"
                            name="paymentMethod"
                            value="PayPal"
                            checked
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        ></Form.Check>

                        {/* <Form.Check
                            type="radio"
                            label="Stripe"
                            id="Stripe"
                            name="paymentMethod"
                            value="Stripe"
                            onChange={(e) => e.target.value}
                        ></Form.Check> */}
                    </Col>
                </Form.Group>
                <Button type="submit" variant="primary">
                    Continue
                </Button>
            </Form>
        </FormContainer>
    );
};

export default PaymentScreen;
