const express = require('express');
const router = express.Router();
const {vali} = require('../utils/courseValidation')
const coursesController = require('../controller/courses-controller');
const verifyToken = require('../middleware/verifytoken');
const allowedTo = require('../middleware/allowedTo');
const userRoles = require('../utils/user-roles');

router.route('/')
    .get(verifyToken,allowedTo(userRoles.ADMIN, userRoles.ROOT),coursesController.getAllCourses)
    .post(verifyToken,allowedTo(userRoles.ROOT),coursesController.addCourse);

router.route('/:courseID')
    .get(coursesController.getSingleCourses)
    .patch(vali(),coursesController.updateCourse)
    .delete(verifyToken,allowedTo(userRoles.ADMIN, userRoles.ROOT),coursesController.deleteCourses)

module.exports = router;