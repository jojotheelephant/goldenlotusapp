import React, { useState, useEffect } from "react";

// import axios for server requests
import axios from "axios";

// import Bootstrap (does not need container module)
import { Row, Col } from "react-bootstrap";

// import Components
import Product from "../Components/Product";

const HomeScreen = () => {
    // useState
    const [products, setProducts] = useState([]);

    // useEffect - axios request to server for product information
    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await axios.get("/api/products");
            setProducts(data);
        };
        fetchProducts();
    }, []);

    return (
        <>
            <h1>Latest Products</h1>
            <Row>
                {products.map((product) => (
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                        {/* Passed into Product Component as a prop */}
                        <Product product={product} />
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default HomeScreen;
