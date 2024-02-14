const httpStatusText = require('../utils/httpStatusText')
const { validationResult } = require('express-validator');
const Course = require('../models/course.model');
const asyncWrapper = require('../middleware/asyncWrapper');
const appError = require('../utils/appError');

const getAllCourses = asyncWrapper(
    async (req, res) => {
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;
        const skip = limit * (page - 1);
        const courses = await Course.find({ price: { $gt: 0 } }, { "__v": false }).limit(limit).skip(skip);
        res.json({ status: httpStatusText.SUCCESS, data: { courses } })
    }
)
const getSingleCourses = asyncWrapper(
    async (req, res, next) => {
        const course = await Course.findById(req.params.courseID)
        if (!course) {
            const error = appError.create('course not found', 404, httpStatusText.ERROR)
            return next(error);
        }
        res.json({ status: httpStatusText.SUCCESS, data: { course } });
        // res.json(404, { status: httpStatusText.ERROR, data: { msg: 'invalid object ID' } })
    }
)
const addCourse = asyncWrapper(
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = appError.create(errors.array(), 400, httpStatusText.FAIL)
            return next(error);
        }
        const newCourse = new Course(req.body);
        await newCourse.save();
        res.send(201, { status: httpStatusText.SUCCESS, data: { newCourse } });
    }
)
const updateCourse = asyncWrapper(
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = appError.create(errors.array(), 400, httpStatusText.FAIL)
            return next(error);
        }
        const updsatedCourse = await Course.updateOne({ _id: req.params.courseID }, { $set: { ...req.body } })
        res.json(200, { status: httpStatusText.SUCCESS, data: { updsatedCourse } });

    })
const deleteCourses = asyncWrapper(
    async (req, res, next) => {
        const course = await Course.findOne({ _id: req.params.courseID });
        if (!course) {
            const error = appError.create('course not found', 404, httpStatusText.FAIL)
            return next(error);        }
        const data = await Course.deleteOne({ _id: req.params.courseID });
        res.json(200, { status: httpStatusText.SUCCESS, msg: data });
    })
module.exports = {
    getAllCourses,
    getSingleCourses,
    addCourse,
    updateCourse,
    deleteCourses
}