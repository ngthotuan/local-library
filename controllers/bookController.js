const { Error } = require('mongoose');
const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookinstance');
const { body, validationResult } = require('express-validator');

exports.index = async function (req, res, next) {
  const names = ['Books', 'Copies', 'Copies Available', 'Authors', 'Genres'];
  try {
    const values = await Promise.all([
      Book.estimatedDocumentCount({}),
      BookInstance.estimatedDocumentCount(),
      BookInstance.countDocuments({ status: 'Available' }),
      Author.estimatedDocumentCount(),
      Genre.estimatedDocumentCount(),
    ]);

    const data = names.map((name, index) => {
      return {
        name,
        value: values[index],
      };
    });
    res.render('index', { title: 'Local Library Home', data });
  } catch (err) {
    res.render('index', { title: 'Local Library Home', err });
  }
};

// Display list of all books.
exports.book_list = async function (req, res, next) {
  try {
    const books = await Book.find({}, 'title author').populate('author');
    res.render('book/list', { title: 'Book lists', books });
  } catch (err) {
    next(err);
  }
};

// Display detail page for a specific book.
exports.book_detail = async function (req, res, next) {
  try {
    const bookId = req.params.id;
    const [book, bookinstances] = await Promise.all([
      Book.findById(bookId).populate('author genre'),
      BookInstance.find({ book: bookId }),
    ]);
    if (book) {
      res.render('book/detail', { title: book.title, book, bookinstances });
    } else {
      const err = new Error('Book not found');
      err.status = 404;
      throw err;
    }
  } catch (err) {
    if (err instanceof Error.CastError) {
      err.message = 'Book not found';
      err.status = 404;
    }
    next(err);
  }
};

// Display book create form on GET.
exports.book_create_get = async function (req, res, next) {
  try {
    const [authors, genres] = await Promise.all([
      Author.find({}),
      Genre.find({}),
    ]);
    res.render('book/create', { title: 'Create book', authors, genres });
  } catch (err) {
    next(err);
  }
};

// Handle book create on POST.
exports.book_create_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === 'undefined') req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    next();
  },

  // Validate and sanitise fields.
  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('author', 'Author must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('summary', 'Summary must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }).escape(),
  body('genre.*').escape(),

  async function (req, res, next) {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data.
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      const [authors, genres] = await Promise.all([
        Author.find({}),
        Genre.find({}),
      ]);
      res.render('book/create', {
        title: 'Create book',
        authors,
        genres,
        book,
        errors: errors.array(),
      });
    } else {
      try {
        await book.save();
        res.redirect(book.url);
      } catch (err) {
        next(err);
      }
    }
  },
];

// Display book delete form on GET.
exports.book_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Book update POST');
};
