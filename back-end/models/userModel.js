import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// With Mongoose, everything is derived from a Schema. Let's get a reference to it and define our users.
const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    { timestamps: true }
);

// custom method for userSchema to run bcrypt.compare to check password match.
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// encrypts password right before saving. Checks if existing password is there before hashing to allow for password updates.
// 'pre' are middleware functions are executed one after another, when each middleware calls next
// 'isModified' is a mongoose method that returns boolean, true of this document was modified.
// '.genSalt' and '.hash' are bcrypt methods of "Technique 1" to hash a password.
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// To use our schema definition, we need to convert our userSchema into a Model we can work with.
// To do so, we pass it into mongoose.model(modelName, schema)
const User = mongoose.model("User", userSchema);

export default User;
