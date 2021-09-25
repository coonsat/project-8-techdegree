const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

// Handler function to wrap each route
const asyncHandler = cb => {
    return async(req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (error) {
            // Forward error to the global error handler
            next(error);
        };
    };
};

const errorHandler = (errorStatus, message, errorName, errorList) => {
    const error = new Error(message);
    error.status = errorStatus;
    error.name = errorName;
    error.errors = errorList;
    throw error;
};

// Route to home page
router.get('/', asyncHandler(async (req, res) => {
    const books = await Book.findAll({order: [[ 'year', 'DESC']]});
    res.render('index', { books } );
    }
  )
);

// Post route to add book to database
router.post('/add-book', asyncHandler(async (req, res) => {
        const book = {
                title: req.body.title,
                author: req.body.author,
                genre: req.body.genre,
                year: req.body.year
        };

        try {
            const newBook = await Book.create({
                title: book.title,
                author: book.author,
                genre: book.genre,
                year: book.year
            });
            await newBook.save();
            res.redirect('/')
        } catch (error) {
            const errors = error.errors;
            res.render('new-book', { book, errors });
        }
    }
  )
);

// Form page for creating a new book
router.get('/new-book', (req, res) => {
    res.render('new-book', {});
});

// See detail page of specific book in list. 
// Redirect to status error if the book entered doesn't exist
router.get('/:id', asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if ( book ) {
        res.render('book-detail', { book });
    } else {
        errorHandler(404, "The book you were looking for could not be found", "Book not found", null);
    }
  }
));

// Render edit page for book
router.get('/:id/edit', asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        res.render('edit-book', { book });
    } else {
        errorHandler(404, "A problem occured when fetching your book", null, null);
    }
  }
)
);

// Edit book from library
router.post('/:id/edit', asyncHandler(async (req, res) => {
        let book = await Book.findByPk(req.params.id);

        try {
            if (book) {
                book = await book.update(req.body);
                res.redirect('/');
            }

        } catch (error) {
            const errors = error.errors;
            res.render('edit-book', { book, errors });
        }

      }
    )
);

// First ask for confirmation to delete book
router.get('/:id/delete', asyncHandler(async (req, res) => {
        const book = await Book.findByPk(req.params.id);
        try {
            if (book) {
                res.render('delete-book', { book });
            }
        } catch (error) {
            errorHandler(404, "A problem occured when deleting your book", error.name, error.errors);
        }
    }
  )
);

// Delete book from library -> no caution added
router.post('/:id/delete', asyncHandler(async (req, res) => {
        const book = await Book.findByPk(req.params.id);
        try {
            if (book) {
                await book.destroy();
                res.redirect('/');
            }
        } catch(error) {
            errorHandler(404, "A problem occured when deleting your book", error.name, error.errors);
        }
    }
  )
);

// Search for books in library
router.post('/search', asyncHandler(async (req, res) => {
    const search = req.body.search.toLowerCase();
    const books = await Book.findAll({
        where: {
            [Op.or]: [
                {title: {[Op.like]: `%${search}%`}},
                {author: {[Op.like]: `%${search}%`}},
                {genre: {[Op.like]: `%${search}%`}}
            ]
        },
        order: [['year', 'DESC']]
    })
    res.render('index', { books });
}));

module.exports = router;