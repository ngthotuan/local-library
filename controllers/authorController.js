const {Error} = require('mongoose');
const Author = require('../models/author');
const Book = require('../models/book');

// Display list of all Authors.
exports.author_list = async function(req, res, next) {
    try {
        const authors = await Author.find({})
        res.render('author/list', {title: 'Author lists', authors})
    } catch(err) {
        next(err);
    }
};

// Display detail page for a specific Author.
exports.author_detail = async function (req, res, next) {
    try {
      const authorId = req.params.id;
      const [author, books] = await Promise.all([
          Author.findById(authorId),
          Book.find({author: authorId})
      ])
      if (author) {
        res.render('author/detail', { title: author.name, author, books});
      } else {
        const err = new Error('author not found');
        err.status = 404;
        throw err;
      }
    } catch (err) {

      if (err instanceof Error.CastError) {
        console.log('else2')

        console.log(req.params.id)
        err.message = 'author not found';
        err.status = 404;
      }
      next(err);
    }
  };
  
// Display Author create form on GET.
exports.author_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create GET');
};

// Handle Author create on POST.
exports.author_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create POST');
};

// Display Author delete form on GET.
exports.author_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST.
exports.author_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET.
exports.author_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.author_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};
