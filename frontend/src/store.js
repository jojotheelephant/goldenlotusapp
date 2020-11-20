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
} from "./reducer/productReducers";
import { cartReducer } from "./reducer/cartReducers";

// an object of reducers are added in and run through combineReducer function then assigned to reducer.
const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    cart: cartReducer,
});

const cartItemsFromStorage = localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [];

const initialState = {
    cart: { cartItems: cartItemsFromStorage },
};

const middleware = [thunk];

// store => createStrore(reducers, initial state, [middleware])
const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
