import React, { useEffect } from "react";
// import Bootstrap (does not need container module)
import { Row, Col } from "react-bootstrap";
// import Components
import Product from "../Components/Product";
import Message from "../Components/Message";
import Loader from "../Components/Loader";
import Paginate from "../Components/Paginate";
// for redux
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions";
import SearchBox from "../Components/SearchBox";
import { Link } from "react-router-dom";
import ProductCarousel from "../Components/ProductCarousel";
import Meta from "../Components/Meta";

const HomeScreen = ({ history, match }) => {
    const keyword = match.params.keyword;
    const pageNumber = match.params.pageNumber || 1;

    // redux
    const dispatch = useDispatch();
    const productList = useSelector((state) => state.productList);
    // pull these from the state
    const { loading, error, products, page, pages, count, pageSize } = productList;

    // useEffect - using redux
    useEffect(() => {
        dispatch(listProducts(keyword, pageNumber));
    }, [dispatch, keyword, pageNumber]);

    return (
        <>
            <Meta />
            {!keyword && (
                <>
                    <ProductCarousel />
                    <br />
                </>
            )}
            {/* Page Title and search bar */}
            <SearchBox
                history={history}
                buttonVariant="primary"
                h1="Latest Products"
                placeholderText="Search Products..."
            />

            {/* Home Page Products */}
            {keyword && (
                <p>
                    Search Result(s) for: "{keyword}"{" "}
                    <Link to={"/"}>
                        <i className="fas fa-times"></i>
                    </Link>
                </p>
            )}
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <>
                    <Row>
                        {products.map((product) => (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                {/* Passed into Product Component as a prop */}
                                <Product product={product} />
                            </Col>
                        ))}
                    </Row>
                    <Paginate
                        pages={pages}
                        page={page}
                        keyword={keyword ? keyword : ""}
                        count={count}
                        pageSize={pageSize}
                    />
                </>
            )}
        </>
    );
};

export default HomeScreen;
