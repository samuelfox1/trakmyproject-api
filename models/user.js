const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");


const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    projects: [{
        type: Schema.Types.ObjectId,
        ref: "Project"
    }],
    data: {
        profilePic: {
            type: String,
            default: "https://i.imgur.com/4DDqtypt.jpg",
        },
        firstName: { type: String },
        lastName: { type: String },
        email: { type: String },
    },
    // friends: [{
    //     type: Schema.Types.ObjectId,
    //     ref: "User"
    // }],
    // comments: [{
    //     type: Schema.Types.ObjectId,
    //     ref: "UserComments"
    // }],
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre("save", function (next) { // 
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) return next();

    // generate a salt
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

const User = mongoose.model("User", UserSchema);
module.exports = User;