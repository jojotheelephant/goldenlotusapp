// controller should handle the functionality of the routes. Routes should do the pointing only.
// async handler --  simple middlware for handling exceptions inside of async express routes and passing
// them to your express error handlers.
import asyncHandler from "express-async-handler";
// import the model.
import User from "../models/userModel.js";
// import generate Token
import generateToken from "../utils/generateToken.js";

// @desc   Auth user & get token
// @route  POST /api/users/login
// @access public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

// @desc   Register user profile
// @route  POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User Already Exists");
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Invalid User Data");
    }
});

// @desc   Get user profile
// @route  GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc   Update user profile
// @route  PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc   Get all users - admin access only
// @route  GET /api/users
// @access Private/Admin
// has search parameters built in. search by name and email
const getUsers = asyncHandler(async (req, res) => {
    const pageSize = 25;
    const page = Number(req.query.pageNumber) || 1;

    const searchUser = req.query.userSearch
        ? {
              $or: [
                  {
                      name: {
                          $regex: req.query.userSearch,
                          $options: "i",
                      },
                  },
                  {
                      email: {
                          $regex: req.query.userSearch,
                          $options: "i",
                      },
                  },
              ],
          }
        : {};

    const count = await User.countDocuments({ ...searchUser });

    const users = await User.find({ ...searchUser })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({
        users,
        page,
        pages: Math.ceil(count / pageSize),
        count,
        pageSize,
    });
});

// @desc   delete selected user - admin access only
// @route  DELETE /api/users
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.remove();
        res.json({ message: "User removed" });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc   Get user by ID - admin access only
// @route  GET /api/users/:id/edit
// @access Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const users = await User.findById(req.params.id).select("-password");
    if (users) {
        res.json(users);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc   Update user
// @route  PUT /api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

export {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
};
