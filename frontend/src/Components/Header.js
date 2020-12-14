import React from "react";
import { useDispatch, useSelector } from "react-redux";
// import from react-bootstrap for easy Navbar, Nav.
// Container uses flexbox like stlying for easy positioning. Refer to React-Bootstrap.
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
// Link Container prevents reloading when link is selected
import { LinkContainer } from "react-router-bootstrap";
import { logout } from "../actions/userActions";

const Header = ({ history }) => {
    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const logoutHandler = () => {
        window.location = "/login";
        dispatch(logout());
    };

    return (
        <header>
            <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect>
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand>
                            <img
                                src="https://png2.cleanpng.com/sh/545a285abc2d99af757c45c37037baf9/L0KzQYm3WMIxN6JsfpH0aYP2gLBuTgNia6NqfJ91b4T4g379hfN1d6MyfARqcHjsc8S0gB9ueKZ5feQ2aXPyfsS0jP91faQyhNH9dYOwdr32lBVzNap0f9M2bXXnecXolPlwdl5xgd5ELYP5d373jvcucZR0hp9vcnWwRbOAgsY5bmc4SKgCM0CxRIW9U8Q4OmU2TaU9OEG3RIa7Uck5O191htk=/kisspng-sacred-lotus-vector-graphics-computer-icons-lotus-lotus-flower-yoga-meditation-lily-svg-png-icon-fre-5b7b68f6306730.4463472415348144541983.png"
                                width="50"
                                height="50"
                                alt="logo"
                            />
                        </Navbar.Brand>
                    </LinkContainer>
                    <LinkContainer to="/">
                        <Navbar.Brand>Golden Lotus</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <LinkContainer to="/" exact>
                                <Nav.Link>
                                    {/* i tags are importing font awesome icons */}
                                    <i className="fas fa-home"></i> Home
                                </Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/cart">
                                <Nav.Link>
                                    {/* i tags are importing font awesome icons */}
                                    <i className="fas fa-shopping-cart"></i> Cart
                                </Nav.Link>
                            </LinkContainer>
                            {/* changes from login to username depending on logged in status */}
                            {userInfo && userInfo.isAdmin && (
                                <NavDropdown title="Admin" id="Adminmenu">
                                    <LinkContainer to="/admin/userlist">
                                        <NavDropdown.Item>Users</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/admin/productlist">
                                        <NavDropdown.Item>Products</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/admin/orderlist">
                                        <NavDropdown.Item>Orders</NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>
                            )}
                            {userInfo ? (
                                <NavDropdown title={userInfo.name} id="username">
                                    <LinkContainer to="/profile">
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Item onClick={logoutHandler}>
                                        Log out
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <LinkContainer to="/login">
                                    <Nav.Link>
                                        {/* i tags are importing font awesome icons */}
                                        <i className="fas fa-user"></i> Sign In
                                    </Nav.Link>
                                </LinkContainer>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
