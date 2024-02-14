const { body } = require("express-validator");
const vali = ()=>{
    return [
        body('title')
            .notEmpty()
            .withMessage('title is required')
            .isLength({min:2})
            .withMessage('title must at least 2 characters'),
        body('price')
            .notEmpty()
            .withMessage('price is required')
            .isLength({min:2})
            .withMessage('price must at least 2 characters'),
    ]
}
module.exports = {vali};