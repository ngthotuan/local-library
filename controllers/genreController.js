const { Error } = require('mongoose');
const Genre = require('../models/genre');
const Book = require('../models/book');
const { body, validationResult } = require('express-validator');

// Display list of all Genre.
exports.genre_list = async function (req, res, next) {
  try {
    const genres = await Genre.find({});
    res.render('genre/list', { title: 'Genre lists', genres });
  } catch (err) {
    next(err);
  }
};

// Display detail page for a specific Genre.
exports.genre_detail = async function (req, res, next) {
  try {
    const genreId = req.params.id;
    const [genre, books] = await Promise.all([
      Genre.findById(genreId),
      Book.find({ genre: genreId }),
    ]);
    if (genre) {
      res.render('genre/detail', {
        title: 'Genre Detail: ' + genre.name,
        genre,
        books,
      });
    } else {
      const err = new Error('Genre not found');
      err.status = 404;
      throw err;
    }
  } catch (err) {
    if (err instanceof Error.CastError) {
      err.message = 'Genre not found';
      err.status = 404;
    }
    next(err);
  }
};

// Display Genre create form on GET.
exports.genre_create_get = function (req, res) {
  res.render('genre/create', { title: 'Create Genre' });
};

// Handle Genre create on POST.
exports.genre_create_post = [
  body('name')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Genre name at least 3 characters')
    .escape(),
  async function (req, res, next) {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a genre object with escaped and trimmed data.
    const { name } = req.body;
    const genre = new Genre({ name });
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('genre/create', {
        title: 'Create Genre',
        genre: genre,
        errors: errors.array(),
      });
    } else {
      try {
        const existGenre = await Genre.findOne({ name });
        if (existGenre) {
          res.redirect(existGenre.url);
        } else {
          await genre.save();
          res.redirect(genre.url);
        }
      } catch (err) {
        next(err);
      }
    }
  },
];

// Display Genre delete form on GET.
exports.genre_delete_get = async function (req, res, next) {
  try {
    const genreId = req.params.id;
    const [genre, books] = await Promise.all([
      Genre.findById(genreId),
      Book.find({ genre: genreId }),
    ]);
    if (genre) {
      res.render('genre/delete', {
        title: 'Delete Genre ' + genre.name,
        genre,
        books,
      });
    } else {
      res.redirect('/catalog/genres');
    }
  } catch (err) {
    if (err instanceof Error.CastError) {
      err.message = 'Genre not found';
      err.status = 404;
    }
    next(err);
  }
};
// Handle Genre delete on POST.
exports.genre_delete_post = async function (req, res, next) {
  try {
    const genreId = req.body.genreId;
    const [genre, books] = await Promise.all([
      Genre.findById(genreId),
      Book.find({ genre: genreId }),
    ]);
    if (books.length > 0) {
      res.render('genre/detail', {
        title: 'Delete Genre ' + genre.name,
        genre,
        books,
      });
    } else {
      await Genre.findByIdAndRemove(genreId);
      res.redirect('/catalog/genres');
    }
  } catch (err) {
    if (err instanceof Error.CastError) {
      err.message = 'Genre not found';
      err.status = 404;
    }
    next(err);
  }
};

// Display Genre update form on GET.
exports.genre_update_get = async function (req, res, next) {
  try {
    const genre = await Genre.findById(req.params.id);
    if (genre) {
      res.render('genre/create', { title: 'Update genre', genre });
    } else {
      const error = new Error('Genre not found');
      error.status = 404;
      throw error;
    }
  } catch (err) {
    next(err);
  }
};

// Handle Genre update on POST.
exports.genre_update_post = [
  body('name')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Genre name at least 3 characters')
    .escape(),
  async function (req, res, next) {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a genre object with escaped and trimmed data.
    const genre = new Genre({ 
      _id: req.params.id,
      name: req.body.name,
    });
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('genre/create', {
        title: 'Update Genre',
        genre: genre,
        errors: errors.array(),
      });
    } else {
      try {
          await Genre.findByIdAndUpdate(req.params.id, genre);
          res.redirect(genre.url);
      } catch (err) {
        next(err);
      }
    }
  },
];
