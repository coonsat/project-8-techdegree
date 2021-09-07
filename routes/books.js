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
        const tempBook = {
                title: req.body.title,
                author: req.body.author,
                genre: req.body.genre,
                year: req.body.year
        };

        try {
            const book = await Book.create({
                title: tempBook.title,
                author: tempBook.author,
                genre: tempBook.genre,
                year: tempBook.year
            });
            await book.save();
            res.redirect('/')
        } catch (error) {
            const errors = error.errors;
            console.log(error)
            res.render('new-book', { tempBook, errors })
        }
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

// Render edit page for book
router.get('/:id/edit', asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        res.render('edit-book', { book });
    } else {
        res.sendStatus(404);
    }
  }
)
);

// Edit book from library
router.post('/:id/edit', asyncHandler(async (req, res) => {
        let book = await Book.findByPk(req.params.id);
        if (book) {
            book = await book.update(req.body);
            res.redirect('/');
        } else {
            res.sendStatus(404);
        }
      }
    )
);

// First ask for confirmation to delete book
router.get('/:id/delete', asyncHandler(async (req, res) => {
        const book = await Book.findByPk(req.params.id);
        if (book) {
            res.render('delete-book', { book });
        } else {
            res.sendStatus(404);
        }
    }
  )
);

// Delete book from library -> no caution added
router.post('/:id/delete', asyncHandler(async (req, res) => {
        const book = await Book.findByPk(req.params.id);
        if (book) {
            await book.destroy();
            res.redirect('/');
        } else {
            res.sendStatus(404);
        }
    }
  )
);

module.exports = router;