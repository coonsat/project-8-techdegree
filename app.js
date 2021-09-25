// const Sequelize = require('sequelize');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const chalk = require('chalk');
const db = require('./models');
const PORT = 4000;

//Highlights
const SUCCESS = 'SUCCESS';
const WARNING = 'WARNING';
const ALARM = 'ALARM',
colour = (colour, text) => {
    switch(colour) {
        case SUCCESS: return chalk.green(text);
        case WARNING: return chalk.orange(text);
        case ALARM: return chalk.red(text);
    };
    return null;
};

// Authenticate the database connection
(async () => {
    await db.sequelize.sync({ force: true});

    try {
        await db.sequelize.authenticate();
        console.log(colour(SUCCESS, 'Connection to the database was successful'));
        
    } catch (error) {

        if (error.name === 'SequelizeValidationError') {
            console.log(colour(WARNING, "The database could not be generated"));
            const errors = error.errors.map(err => err.message);
            console.log(colour(WARNING, errors));
        } else {
            throw error;
        }
    };
});


// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Instantiate the routes
app.use('/', require('./routes'));
app.use('/books', require('./routes/books'));

// Catch 404 and forward to error handler
app.use( (req, res, next) => {
    next(createError(404));
});

// Global error handler
app.use( (err, req, res, next) => {
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.log(err)
    // Render the error page

    // if (err.name === 'Book not found') {
    //     const msg = err.name;
    //     res.render('page-not-found', {msg, err}); 
    // }

    if (err.status === 404) {
        const message = err.message;
        res.render('page-not-found', { message, err });
    } else {

        if (err.name === 'SequelizeValidationError') {
            const sqlMessage = 'It seems like there was a validation error';
            res.render('error',  { sqlMessage, err });
        } else {
            const message = 'An error occured.';
            res.status(err.status || 500);
            res.render('error',  { message, err });
        }
    }
    next();
});

app.listen(PORT, () => {
    console.log(colour(SUCCESS, `The application is now running on port ${PORT}`));
});

module.exports = app;
