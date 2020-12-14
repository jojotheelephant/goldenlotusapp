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
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import OrderListScreen from "./screens/OrderListScreen";
import SearchBox from "./Components/SearchBox";

const App = () => {
    return (
        <Router>
            <Header />
            <main className="py-3">
                <Container>
                    <Route path="/shipping" component={ShippingScreen} />
                    <Route path="/order/:id" component={OrderScreen} />
                    <Route path="/placeorder" component={PlaceOrderScreen} />
                    <Route path="/payment" component={PaymentScreen} />
                    <Route path="/login" component={LoginScreen} />
                    <Route path="/profile" component={ProfileScreen} />
                    <Route path="/register" component={RegisterScreen} />
                    <Route path="/product/:id" component={ProductScreen} />
                    <Route path="/cart/:id?" component={CartScreen} />
                    {/* userlists */}
                    <Route
                        path="/admin/userlist"
                        component={UserListScreen}
                        exact
                    />
                    <Route
                        path="/admin/userlist/search/:keyword/"
                        component={UserListScreen}
                        exact
                    />
                    <Route
                        path="/admin/userlist/page/:pageNumber"
                        component={UserListScreen}
                        exact
                    />
                    <Route
                        path="/admin/userlist/search/:keyword/page/:pageNumber"
                        component={UserListScreen}
                        exact
                    />
                    {/* orderlist */}
                    <Route
                        path="/admin/orderlist"
                        component={OrderListScreen}
                    />
                    {/* productlist */}
                    <Route
                        path="/admin/productlist"
                        component={ProductListScreen}
                        exact
                    />
                    <Route
                        path="/admin/productlist/search/:keyword/"
                        component={ProductListScreen}
                        exact
                    />
                    <Route
                        path="/admin/productlist/page/:pageNumber"
                        component={ProductListScreen}
                        exact
                    />
                    <Route
                        path="/admin/productlist/search/:keyword/page/:pageNumber"
                        component={ProductListScreen}
                        exact
                    />
                    <Route
                        path="/admin/user/:id/edit"
                        component={UserEditScreen}
                    />
                    <Route
                        path="/admin/product/:id/edit"
                        component={ProductEditScreen}
                    />
                    {/* homepage */}
                    <Route
                        path="/search/:keyword"
                        component={HomeScreen}
                        exact
                    />
                    <Route
                        path="/search/:keyword/page/:pageNumber"
                        component={HomeScreen}
                    />
                    <Route path="/page/:pageNumber" component={HomeScreen} />
                    <Route path="/" component={HomeScreen} exact />
                </Container>
            </main>
            <Footer />
        </Router>
    );
};

export default App;
