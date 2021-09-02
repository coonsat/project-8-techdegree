const Sequelize = require('sequelize');
const express = require('express');
const path = require('path');
// const cookieParser = require('cookie-parser');
// const logger = require('morgan');
const app = express();
const chalk = require('chalk');

// // get instantiated sequelize -- NOT SURE WHAT IM DOING HERE!!
const db = require('./models');
// const { Book } = db.models;
// const Book = require('./models').Book;

// // Determine the routes
// const routes = require('./routes/books');

// // Set up view engine
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// // Instantiate the routes
// app.use('/', routes);

// // Catch 404 and forward to error handler
// app.use( (req, res, next) => {
//     next(createError(404));
// });

// // Error handler
// app.use( (err, req, res, next) => {
//     // Set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // Render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

// module.exports = app;

(async () => {
    await db.sequelize.sync({ force: true });

    try {
        await db.sequelize.authenticate();
        console.log('Connection to the database was successful!');

        const book = await Book.create({
            title: 'The land of the dead',
            author: 'Somting wong',
            genre: 'romance',
            year: '2018'
        });
        await book.save();
        console.log(book.toJSON());

    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const errors = errors.errors.map(err => err.message);
            console.log(chalk.red('A validation has been violed: ') + errors);
        } else {
            throw error;
        }
    }

})();
