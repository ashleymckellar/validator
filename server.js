const express = require('express');
const app = express();
require('dotenv').config();
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const { expressjwt } = require('express-jwt');
process.env.SECRET;
const PORT = process.env.PORT || 8200;
const uri = process.env.MONGO_URI;

app.use(express.json());
app.use(morgan('dev'));

const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
    } catch (err) {
        console.log(err);
    }
};

connectToDb();

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.use(
    '/api',
    expressjwt({ secret: process.env.SECRET, algorithms: ['HS256'] }),
);
app.use('/auth', require('./routes/authRouter.js'));

app.use((err, req, res, next) => {
    console.log(err);
    if (err.name === 'UnauthorizedError') {
        res.status(err.status);
    }
    return res.send({ errMsg: err.message });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
