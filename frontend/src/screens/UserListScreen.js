import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../Components/Message";
import Loader from "../Components/Loader";
import { listUsers, deleteUser } from "../actions/userActions";
import { ModalDelete } from "../Components/Modal";
import Paginate from "../Components/Paginate";
import SearchBox from "../Components/SearchBox";
import { Link } from "react-router-dom";

const UserListScreen = ({ history, match }) => {
    const dispatch = useDispatch();
    const pageNumber = match.params.pageNumber || 1;
    const keyword = match.params.keyword;

    // get Redux States
    const userList = useSelector((state) => state.userList);
    const { loading, error, users, page, pages, count, pageSize } = userList;
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const userDelete = useSelector((state) => state.userDelete);
    const { success: successDelete } = userDelete;

    // MODAL
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [modalState, setModalState] = useState({});
    const modifyModalState = (modal) => {
        setModalState(modal);
        handleShow();
    };

    // UseEffect
    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listUsers(keyword, pageNumber));
        } else {
            history.push("/login");
        }
    }, [dispatch, history, userInfo, successDelete, pageNumber, keyword]);

    // handlers
    const deleteHandler = (id) => {
        handleClose();
        dispatch(deleteUser(id));
    };

    return (
        <>
            <SearchBox
                history={history}
                buttonVariant="primary"
                h1="Users"
                placeholderText="Search Users..."
                routePrefix="/admin/userlist"
            />
            {keyword && (
                <p>
                    Search Result(s) for: {keyword}{" "}
                    <Link to={"/admin/userlist"}>
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
                                <th>EMAIL</th>
                                <th>ID</th>
                                <th>ADMIN</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>
                                        <a href={`mailto:${user.email}`}>
                                            {user.email}
                                        </a>
                                    </td>
                                    <td>{user._id}</td>
                                    <td>
                                        {user.isAdmin ? (
                                            <i
                                                className="fas fa-check"
                                                style={{ color: "green" }}
                                            ></i>
                                        ) : (
                                            <i
                                                className="fas fa-times"
                                                style={{ color: "red" }}
                                            ></i>
                                        )}
                                    </td>
                                    <td>
                                        <LinkContainer
                                            to={`/admin/user/${user._id}/edit`}
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
                                                modifyModalState(user)
                                            }
                                        >
                                            <i className="fas fa-trash"></i>
                                        </Button>
                                        <ModalDelete
                                            key={modalState._id}
                                            show={show}
                                            onHide={handleClose}
                                            title={`Delete User - ${modalState.name}`}
                                            body={`
                                        Deleting user from this list will not remove their existing order(s). 
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
                        routePrefix="/admin/userlist"
                        keyword={keyword}
                        pageNumber={pageNumber}
                    />
                </>
            )}
        </>
    );
};

export default UserListScreen;
