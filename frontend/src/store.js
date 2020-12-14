// import modules from redux and connect middleware.
// createStore creates a new store
// combineReducers manages the reducers in an object
// applymiddle allows for us to apply middleware
import { createStore, combineReducers, applyMiddleware } from "redux";
// middleware to allow for async request for the action.
import thunk from "redux-thunk";
// allows for us to use dev tools on the browser extensions
import { composeWithDevTools } from "redux-devtools-extension";
// import reducers
import {
    productListReducer,
    productDetailsReducer,
    productDeleteReducer,
    productCreateReducer,
    productUpdateReducer,
    productCreateReviewReducer,
    productTopRatedReducer,
} from "./reducer/productReducers";
import { cartReducer } from "./reducer/cartReducers";
import {
    userLoginReducer,
    userRegisterReducer,
    userDetailsReducer,
    userUpdateProfileReducer,
    userListReducer,
    userDeleteReducer,
    userUpdateReducer,
} from "./reducer/userReducers";
import {
    orderCreateReducer,
    orderDeliverReducer,
    orderDetailsRequest,
    orderListMyReducer,
    orderListReducer,
    orderPayReducer,
} from "./reducer/orderReducers.js";

// an object of reducers are added in and run through combineReducer function then assigned to reducer.
const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    productCreate: productCreateReducer,
    productUpdate: productUpdateReducer,
    productCreateReview: productCreateReviewReducer,
    productTopRated: productTopRatedReducer,
    productDelete: productDeleteReducer,
    cart: cartReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    userUpdate: userUpdateReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsRequest,
    orderPay: orderPayReducer,
    orderDeliver: orderDeliverReducer,
    orderListMy: orderListMyReducer,
    orderList: orderListReducer,
});

const cartItemsFromStorage = localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [];

const userInfoFromStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

const shippingAddressFromStorage = localStorage.getItem("shippingAddress")
    ? JSON.parse(localStorage.getItem("shippingAddress"))
    : {};

const initialState = {
    cart: {
        cartItems: cartItemsFromStorage,
        shippingAddress: shippingAddressFromStorage,
    },
    userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

// store => createStrore(reducers, initial state, [middleware])
const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
