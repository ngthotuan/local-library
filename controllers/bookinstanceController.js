const BookInstance = require('../models/bookinstance');
const Book = require('../models/book');
const { body, validationResult } = require('express-validator');
const { Error } = require('mongoose');

// Display list of all BookInstances.
exports.bookinstance_list = async function (req, res, next) {
  try {
    const bookinstances = await BookInstance.find({}).populate('book');
    res.render('bookinstance/list', {
      title: 'Book instance lists',
      bookinstances,
    });
  } catch (err) {
    next(err);
  }
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = async function (req, res, next) {
  try {
    const bookinstance = await BookInstance.findById(req.params.id).populate(
      'book'
    );
    if (bookinstance) {
      res.render('bookinstance/detail', {
        title: 'Book instance ' + bookinstance.book.title,
        bookinstance,
      });
    } else {
      const err = new Error('Book instance not found');
      err.status = 404;
      throw err;
    }
  } catch (err) {
    if (err instanceof Error.CastError) {
      err.message = 'Book instance not found';
      err.status = 404;
    }
    next(err);
  }
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = async function (req, res) {
  const books = await Book.find({});
  res.render('bookinstance/create', { title: 'Create book instance', books });
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
  body('book').exists().withMessage('Must specify a book').escape(),
  body('imprint').exists().withMessage('Imprint is required').escape(),
  body('dueBack')
    .optional({ checkFalsy: false })
    .isISO8601()
    .withMessage('Date with format yyyy-mm-dd')
    .toDate(),
  body('status')
    .isIn(['Maintenance', 'Available', 'Loaned', 'Reserved'])
    .withMessage(
      'Status must in ' +
        ['Maintenance', 'Available', 'Loaned', 'Reserved'].toString()
    ),
  async function (req, res, next) {
    const errors = validationResult(req);
    const bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.dueBack,
    });
    if (!errors.isEmpty()) {
      const books = await Book.find({});
      res.render('bookinstance/create', {
        title: 'Create book instance',
        books,
        errors: errors.array(),
        bookinstance: req.body,
      });
    } else {
      try {
        await bookinstance.save();
        res.redirect(bookinstance.url);
      } catch (err) {
        next(err);
      }
    }
  },
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = async function (req, res, next) {
  try {
    const bookinstance = await BookInstance.findById(req.params.id).populate(
      'book'
    );
    if (bookinstance) {
      res.render('bookinstance/delete', {
        title: 'Delete book instance ' + bookinstance.book.title,
        bookinstance,
      });
    } else {
      res.redirect('/catalog/bookinstances');
    }
  } catch (err) {
    if (err instanceof Error.CastError) {
      err.message = 'Book instance not found';
      err.status = 404;
    }
    next(err);
  }
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = async function (req, res, next) {
  try {
    await BookInstance.findByIdAndRemove(req.body.bookInstanceId);
    res.redirect('/catalog/bookinstances');
  } catch (err) {
    if (err instanceof Error.CastError) {
      err.message = 'Book instance not found';
      err.status = 404;
    }
    next(err);
  }
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = async function (req, res, next) {
  try {
    const [bookinstance, books] = await Promise.all([
      BookInstance.findById(req.params.id),
      Book.find({}),
    ])
    if (bookinstance) {
      res.render('bookinstance/create', {
        title: 'Update book instance',
        bookinstance,
        books,
      });
    } else {
      const error = new Error('Book instance not found');
      error.status = 404;
      throw error;
    }
  } catch (err) {
    next(err);
  }
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = [
  body('book').exists().withMessage('Must specify a book').escape(),
  body('imprint').exists().withMessage('Imprint is required').escape(),
  body('dueBack')
    .optional({ checkFalsy: false })
    .isISO8601()
    .withMessage('Date with format yyyy-mm-dd')
    .toDate(),
  body('status')
    .isIn(['Maintenance', 'Available', 'Loaned', 'Reserved'])
    .withMessage(
      'Status must in ' +
        ['Maintenance', 'Available', 'Loaned', 'Reserved'].toString()
    ),
  async function (req, res, next) {
    const errors = validationResult(req);
    const bookinstance = new BookInstance({
      _id: req.params.id,
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.dueBack,
    });
    if (!errors.isEmpty()) {
      const books = await Book.find({});
      res.render('bookinstance/create', {
        title: 'Update book instance',
        books,
        errors: errors.array(),
        bookinstance: req.body,
      });
    } else {
      try {
        await BookInstance.findByIdAndUpdate(req.params.id, bookinstance);
        res.redirect(bookinstance.url);
      } catch (err) {
        next(err);
      }
    }
  },
];