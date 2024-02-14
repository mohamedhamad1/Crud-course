const mongoose = require('mongoose');
const { isEmail } = require('validator');
const userRoles = require('../utils/user-roles');
const usersSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: [isEmail, 'filed must be a valid email address']
    },
    password: {
        type: String,
        required: true,
        min:[6, 'password must be at least 6 characters'],
    },
    token: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum:[userRoles.USER, userRoles.ADMIN, userRoles.ROOT],
        default: userRoles.USER,
    },
    avatar:{
        type: String,
        default: 'uploads/profile.jpg'
    }
})
module.exports = mongoose.model('User', usersSchema);