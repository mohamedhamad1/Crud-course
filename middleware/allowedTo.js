const appError = require("../utils/appError");

module.exports = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.currentUser.role)){
            return next(appError.create('this role is not allowed', 401))
        }
        next();
    }
}