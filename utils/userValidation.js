const { body } = require("express-validator");
const registrValidator = ()=>{
    return [
        body('email')
            .isEmail().withMessage('email must be a valid email address')
            .notEmpty().withMessage('email is required'),
        body('fName')
            .notEmpty().withMessage('first name is required')
            .isLength({min:1}).withMessage('first name must at least 1 characters'),
        body('lName')
            .notEmpty().withMessage('last name is required')
            .isLength({min:1}).withMessage('last name must at least 1 characters'),
        body('password')
            .notEmpty().withMessage('password is required')
            .isLength({min:6}).withMessage('password must at least 6 characters'),
    ]
}
const loginValidator = ()=>{
    return [
        body('email')
            .isEmail().withMessage('email must be a valid email address')
            .notEmpty().withMessage('email is required'),
        body('password')
            .notEmpty().withMessage('password is required')
            .isLength({min:6}).withMessage('password must at least 6 characters'),
    ]
}
module.exports = {registrValidator,loginValidator};