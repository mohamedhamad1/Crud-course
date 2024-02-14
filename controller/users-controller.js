let { users } = require('../dataBase/users-data')
const User = require('../models/users.model')
const httpStatusText = require('../utils/httpStatusText')
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateJWT = require('../utils/generateJWT');
const appError = require('../utils/appError');
const asyncWrapper = require('../middleware/asyncWrapper');

const getAllUsers = async (req, res) => {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const skip = limit * (page - 1);
    const users = await User.find({}, { '__v': false }).limit(limit).skip(skip);
    res.json({ status: httpStatusText.SUCCESS, data: { users } })
}

const register = asyncWrapper(
    async (req, res, next) => {
        const { fname, lname, password, email, role } = req.body
        console.log(req.file);
        const user = await User.findOne({ email: email });
        if (user) {
            const error = appError.create('user already exists', 400, httpStatusText.FAIL);
            return next(error);
        }
        const passwordHshing = await bcrypt.hash(password, 10)
        const newUser = new User({
            fname,
            lname,
            email,
            password: passwordHshing,
            role,
            avatar: req.file.filename,
        })
        const token = await generateJWT({ email: newUser.email, lname: newUser._id, role: newUser.role});
        newUser.token = token;
        await newUser.save();
        res.json(201, { status: httpStatusText.SUCCESS, data: { user: newUser } })
    })

const login = asyncWrapper(
    async (req, res, next) => {
        const { email, password } = req.body;
        if (!email || !password) {
            const error = appError.create('email and password required', 404, httpStatusText.FAIL);
            return next(error);
        }
        const user = await User.findOne({ email: email });
        if (!user) {
            const error = appError.create('user does not exists', 404, httpStatusText.FAIL);
            return next(error);
        }
        const matchedPassword = await bcrypt.compare(password, user.password);
        if (!matchedPassword) {
            const error = appError.create('invalid credintioanl', 400, httpStatusText.FAIL);
            return next(error);
        }
        const token = await generateJWT({ email: user.email, id: user._id, role: user.role })
        res.json(200, { status: httpStatusText.SUCCESS, data: { token } })
    })

module.exports = {
    getAllUsers,
    register,
    login
}