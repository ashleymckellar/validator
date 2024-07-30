const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
});

userSchema.pre('validate', function (next) {
    const user = this;
    const password = user.password;
    const email = user.email;
    console.log(user);
    if (!validator.isStrongPassword(password)) {
        return next(new Error('Weak ass password'));
    }
    if (!validator.isEmail(email)) {
        return next(new Error("that's not an email address, dummy"));
    }
    next();
});

userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});

userSchema.methods.checkPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.withoutPassword = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

module.exports = mongoose.model('User', userSchema);
