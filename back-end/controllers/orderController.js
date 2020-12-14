// controller should handle the functionality of the routes. Routes should do the pointing only.

// async handler --  simple middlware for handling exceptions inside of async express routes and passing
// them to your express error handlers.
import asyncHandler from "express-async-handler";
// import the model.
import Order from "../models/orderModel.js";

// @desc   Create new order
// @route  POST /api/orders
// @access private
const addOrderItems = asyncHandler(async (req, res, next) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error("No order items");
        return;
    } else {
        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
    }
});

// @desc   Get order by ID
// @route  GET /api/orders/:id
// @access private
const getOrderById = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

// @desc   Update order to paid
// @route  PUT /api/orders/:id/pay
// @access private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        // object sent back from paypal. may vary with different payment services
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        };

        const updateOrder = await order.save();

        res.json(updateOrder);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

// @desc   Get logged in user order
// @route  GET /api/orders/myorders
// @access private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
});

// @desc   Get all orders
// @route  GET /api/orders/
// @access private/admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate("user", "id name");
    res.json(orders);
});

// @desc   Update order to delivered
// @route  PUT /api/orders/:id/deliver
// @access private/admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updateOrder = await order.save();

        res.json(updateOrder);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

export {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    getOrders,
    updateOrderToDelivered,
};
