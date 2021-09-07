const Sequelize = require('sequelize');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const chalk = require('chalk');
const Book = require('./models').Book;
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
    console.log('I am here');

    await db.sequelize.sync({ force: true});
    console.log('I am here');

    try {

        await db.sequelize.authenticate();
        console.log(colour(SUCCESS, 'Connection to the database was successful'));

    } catch (error) {

        if (error.name === 'SequelizeValidationError') {
            console.log(colour(WARNING, "A validation error in the database exists"));
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

// Error handler
app.use( (err, req, res, next) => {
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(PORT, () => {
    console.log(colour(SUCCESS, `The application is now running on port ${PORT}`));
});

module.exports = app;


// (async () => {
//     await db.sequelize.sync({ force: true });

//     try {
//         await db.sequelize.authenticate();
//         console.log(chalk.green('Connection to the database was successful!'));

//         const book = await Book.create({
//             title: 'The land of the dead',
//             author: 'Somting wong',
//             genre: 'romance',
//             year: 2018
//         });
//         await book.save();
//         console.log(book.toJSON());

//     } catch (error) {
//         const errors = errors.errors.map(err => err.message);
//         if (error.name === 'SequelizeValidationError') {
//             console.log(chalk.red('A validation has been violated: ') + errors);
//         } else {
//             console.log(chalk.red('The following error has occured: ') + errors);
//             throw error;
//         }
//     }

// })();
