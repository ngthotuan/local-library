const { Error } = require('mongoose');
const Author = require('../models/author');
const Book = require('../models/book');
const { body, validationResult } = require('express-validator');

// Display list of all Authors.
exports.author_list = async function (req, res, next) {
  try {
    const authors = await Author.find({});
    res.render('author/list', { title: 'Author lists', authors });
  } catch (err) {
    next(err);
  }
};

// Display detail page for a specific Author.
exports.author_detail = async function (req, res, next) {
  try {
    const authorId = req.params.id;
    const [author, books] = await Promise.all([
      Author.findById(authorId),
      Book.find({ author: authorId }),
    ]);
    if (author) {
      res.render('author/detail', { title: 'Author Detail: ' + author.name, author, books });
    } else {
      const err = new Error('author not found');
      err.status = 404;
      throw err;
    }
  } catch (err) {
    if (err instanceof Error.CastError) {
      console.log('else2');

      console.log(req.params.id);
      err.message = 'author not found';
      err.status = 404;
    }
    next(err);
  }
};

// Display Author create form on GET.
exports.author_create_get = function (req, res) {
  res.render('author/create', { title: 'Create Author' });
};

// Handle Author create on POST.
exports.author_create_post = [
  // Validate and sanitize fields.
  body('firstName')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('First name must be specified.'),
  body('lastName')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Family name must be specified.'),
  body('dob', 'Invalid date of birth')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body('dod', 'Invalid date of death')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  async function (req, res, next) {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a genre object with escaped and trimmed data.
    const { firstName, lastName, dob, dod } = req.body;
    const author = new Author({
      first_name: firstName,
      family_name: lastName,
      date_of_birth: dob,
      date_of_death: dod,
    });
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('author/create', {
        title: 'Create Author',
        author,
        errors: errors.array(),
      });
    } else {
      try {
        await author.save();
        res.redirect(author.url);
      } catch (err) {
        next(err);
      }
    }
  },
];

// Display Author delete form on GET.
exports.author_delete_get = async function (req, res, next) {
  try {
    const [author, books] = await Promise.all([
      Author.findById(req.params.id),
      Book.find({ author: req.params.id }),
    ]);
    if (!author) {
      res.redirect('/catalog/authors');
    } else {
      res.render('author/delete', {
        title: 'Delete Author: ' + author.name,
        author,
        books,
      });
    }
  } catch (err) {
    if (err instanceof Error.CastError) {
      err.message = 'Author not found';
      err.status = 404;
    }
    next(err);
  }
};

// Handle Author delete on POST.
exports.author_delete_post = async function (req, res, next) {
  try {
    const [author, books] = await Promise.all([
      Author.findById(req.body.authorId),
      Book.find({ author: req.body.authorId }),
    ]);
    if (books.length > 0) {
      // Author has books. Render in same way as for GET route.
      res.render('author/delete', {
        title: 'Delete Author',
        author,
        books,
      });
    } else {
      // Author has no books. Delete object and redirect to the list of authors.
      await Author.findByIdAndRemove(req.body.authorId);
      res.redirect('/catalog/authors');
    }
  } catch (err) {
    next(err);
  }
};

// Display Author update form on GET.
exports.author_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.author_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Author update POST');
};
