import React from "react";

// import React-Router
import { BrowserRouter as Router, Route } from "react-router-dom";

// import Bootstrap
import { Container } from "react-bootstrap";

// Component Import
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";

const App = () => {
    return (
        <Router>
            <Header />
            <main className="py-3">
                <Container>
                    <Route path="/" component={HomeScreen} exact />
                    <Route path="/product/:id" component={ProductScreen} />
                </Container>
            </main>
            <Footer />
        </Router>
    );
};

export default App;
