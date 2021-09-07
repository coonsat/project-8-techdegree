const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

// Handler function to wrap each route
function asyncHandler(cb) {
    return async(req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (error) {
            // Forward error to the global error handler
            next(error);
        };
    };
};

// Route to home page
router.get('/', asyncHandler(async (req, res) => {
    const books = await Book.findAll({ order: [[ 'createdAt', 'DESC']] });
    res.render('index', { books } );
    }
  )
);

// Post route to add book to database
router.post('/add-book', asyncHandler(async (req, res) => {
    const book = await Book.create({
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        year: req.body.year
    });
    await book.save();
    res.redirect('/');
    }
  )
);

// Form page for creating a new book
router.get('/new-book', (req, res) => {
    res.render('new-book');
});

// See detail page of specific book in list. 
// Redirect to status error if the book entered doesn't exist
router.get('/:id', asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        res.render('book-detail', { book });
    } else {
        res.sendStatus(404);
    }
  }
));

router.get('/:id/edit', asyncHandler(async (req, res) => {
        const book = await Book.findByPk(req.params.id);
        if (book) {
            book = await book.update(req.body);
            res.redirect(`books/${book.id}`);
        } else {
            res.sendStatus(404);
        }
      }
    )
);



module.exports = router;