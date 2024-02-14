require('dotenv').config();
const express = require('express');
const cors = require('cors');
const coursesRouters = require('./routes/courses-routes');
const usersRouters = require('./routes/users-routes');
const httpStatusText = require('./utils/httpStatusText')
const mongoose = require('mongoose');
const port = process.env.PORT;
const app = express();
const path = require('path');
const uri = process.env.MONGODB_URI;
app.use('/uploads', express.static(path.join(__dirname,'uploads')));

mongoose.connect(uri).then(() => {
    console.log('Connected to MongoDB');
})

app.use(cors());
app.use(express.json());

app.use('/api/courses', coursesRouters)
app.use('/api/users', usersRouters)

app.all('*', (req, res, next) => {
    return res.json(404, { status: httpStatusText.ERROR, message: 'this resource is not available' })
})

app.use((error, req, res, next) => {
    res.json({status: error.statusText||httpStatusText.ERROR, msg:error.message,code:error.statusCode || 500,data:null})
});

app.listen(port, () => {
    console.log('listening on port', port);
})
