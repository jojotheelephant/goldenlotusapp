import React from "react";

// import from react-bootstrap for easy Navbar, Nav.
// Container uses flexbox like stlying for easy positioning. Refer to React-Bootstrap.
import { Navbar, Nav, Container } from "react-bootstrap";
// Link Container prevents reloading when link is selected
import { LinkContainer } from "react-router-bootstrap";

const Header = () => {
    return (
        <header>
            <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand>Golden Lotus</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <LinkContainer to="/cart">
                                <Nav.Link>
                                    {/* i tags are importing font awesome icons */}
                                    <i className="fas fa-shopping-cart"></i>{" "}
                                    Cart
                                </Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/login">
                                <Nav.Link>
                                    {/* i tags are importing font awesome icons */}
                                    <i className="fas fa-user"></i> Sign In
                                </Nav.Link>
                            </LinkContainer>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
