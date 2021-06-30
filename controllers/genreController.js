const { Error } = require('mongoose');
const Genre = require('../models/genre');
const Book = require('../models/book');

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
      res.render('genre/detail', { title: 'Genre Detail', genre, books });
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
  res.send('NOT IMPLEMENTED: Genre create GET');
};

// Handle Genre create on POST.
exports.genre_create_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre create POST');
};

// Display Genre delete form on GET.
exports.genre_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
exports.genre_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre update POST');
};
