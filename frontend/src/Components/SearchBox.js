import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const SearchBox = ({ history, buttonVariant, h1, placeholderText, routePrefix = "" }) => {
    const [keyword, setKeyword] = useState("");

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            history.push(`${routePrefix}/search/${keyword}`);
        } else {
            history.push(`${routePrefix}/`);
        }
    };

    const keyPressHandler = (target) => {
        if (target.charCode === 13) {
            submitHandler();
        }
    };

    return (
        <Form onSubmit={submitHandler} className="form-inline">
            <h1>{h1}</h1>
            <Form.Control
                type="text"
                name="q"
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={placeholderText}
                className="ml-auto mb-2"
            ></Form.Control>
            <Button
                type="submit"
                variant={buttonVariant}
                onKeyPress={keyPressHandler}
                className="ml-2 mb-2 p-2"
            >
                Search
            </Button>
        </Form>
    );
};

export default SearchBox;
