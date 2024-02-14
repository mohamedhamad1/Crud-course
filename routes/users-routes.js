const express = require('express');
const router = express.Router();
const userValidation = require('../utils/userValidation')
const usersController = require('../controller/users-controller')
const verifyToken = require('../middleware/verifytoken');
const multer = require('multer');
const appError = require('../utils/appError');

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        const filename = `user-${Date.now()}.${ext}`;
        cb(null, filename)
    }
})

const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0];
    if(imageType === 'image'){
        return cb(null, true);
    }else{
        return cb(appError.create('file type not allowed', 401), true);
    }
}

const upload = multer({
    storage: diskStorage,
    fileFilter: fileFilter
});

router.route('/')
    .get(verifyToken, usersController.getAllUsers)

router.route('/register')
    .post(upload.single('avatar'), usersController.register)

router.route('/login')
    .post(userValidation.loginValidator(), usersController.login)

module.exports = router
