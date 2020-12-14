import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../Components/Message";
import Loader from "../Components/Loader";
import Paginate from "../Components/Paginate";
import {
    listProducts,
    deleteProduct,
    createProduct,
} from "../actions/productActions";
import { ModalDelete } from "../Components/Modal";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";
import SearchBox from "../Components/SearchBox";
import { Link } from "react-router-dom";

const ProductListScreen = ({ history, match }) => {
    const dispatch = useDispatch();
    const pageNumber = match.params.pageNumber || 1;
    const keyword = match.params.keyword;

    // get State from Redux
    const productList = useSelector((state) => state.productList);
    const {
        loading,
        error,
        products,
        pages,
        page,
        pageSize,
        count,
    } = productList;

    const productDelete = useSelector((state) => state.productDelete);
    const {
        loading: loadingDelete,
        error: errorDelete,
        success: successDelete,
    } = productDelete;

    const productCreate = useSelector((state) => state.productCreate);
    const {
        loading: loadingCreate,
        error: errorCreate,
        success: successCreate,
        product: createdProduct,
    } = productCreate;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    // MODAL
    const [show, setShow] = useState(false);
    const [modalState, setModalState] = useState({});
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const modifyModalState = (modal) => {
        setModalState(modal);
        handleShow();
    };

    // useEffect
    useEffect(() => {
        dispatch({ type: PRODUCT_CREATE_RESET });
        if (!userInfo.isAdmin) {
            history.push("/login");
        }

        if (successCreate) {
            history.push(`/admin/product/${createdProduct._id}/edit`);
        } else {
            dispatch(listProducts(keyword, pageNumber));
        }
    }, [
        dispatch,
        history,
        userInfo,
        loadingDelete,
        successDelete,
        successCreate,
        createdProduct,
        pageNumber,
        keyword,
        match,
    ]);

    // handlers
    const deleteHandler = (id) => {
        handleClose();
        dispatch(deleteProduct(id));
    };

    const createProductHandler = () => {
        dispatch(createProduct());
    };

    return (
        <>
            <SearchBox
                history={history}
                buttonVariant="primary"
                h1="Products"
                placeholderText="Search Products..."
                routePrefix="/admin/productlist"
            />

            <Button className="mb-4" onClick={createProductHandler}>
                <i className="fas fa-plus"></i> Create Product
            </Button>
            {keyword && (
                <p>
                    Search Result(s) for: {keyword}{" "}
                    <Link to={"/admin/productlist"}>
                        <i className="fas fa-times"></i>
                    </Link>
                </p>
            )}
            {loadingDelete && <Loader />}
            {errorDelete && <Message variant="danger">{errorDelete}</Message>}
            {loadingCreate && <Loader />}
            {errorCreate && <Message variant="danger">{errorCreate}</Message>}
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <>
                    <Table
                        striped
                        bordered
                        hover
                        responsive
                        className="table-sm"
                    >
                        <thead>
                            <tr>
                                <th>NAME</th>
                                <th>BRAND</th>
                                <th>PRICE</th>
                                <th>CATEGORY</th>
                                <th>ID</th>

                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product.name}</td>
                                    <td>{product.brand}</td>
                                    <td>${product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product._id}</td>

                                    <td>
                                        <LinkContainer
                                            to={`/admin/product/${product._id}/edit`}
                                        >
                                            <Button
                                                variant="light"
                                                className="btn-sm"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </Button>
                                        </LinkContainer>
                                        {/* delete button  */}
                                        <Button
                                            variant="danger"
                                            className="btn-sm"
                                            onClick={() =>
                                                modifyModalState(product)
                                            }
                                        >
                                            <i className="fas fa-trash"></i>
                                        </Button>
                                        <ModalDelete
                                            key={modalState._id}
                                            show={show}
                                            onHide={handleClose}
                                            title={`Delete Product - ${modalState.name}`}
                                            body={`
                                        Deleting product from this list will not remove product from existing order(s). 
                                        All user information will be lost and this action cannot by undone.
                                        Are you sure you want to delete ${modalState.name}?`}
                                            data={modalState}
                                            secondaryClick={handleClose}
                                            primaryClick={() =>
                                                deleteHandler(modalState._id)
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Paginate
                        pages={pages}
                        page={page}
                        isAdmin={true}
                        pageSize={pageSize}
                        count={count}
                        routePrefix="/admin/productlist"
                        keyword={keyword}
                        pageNumber={pageNumber}
                    />
                </>
            )}
        </>
    );
};

export default ProductListScreen;
