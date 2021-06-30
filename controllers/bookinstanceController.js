const BookInstance = require('../models/bookinstance');

// Display list of all BookInstances.
exports.bookinstance_list = async function(req, res, next) {
    try {
        const bookinstances = await BookInstance.find({}).populate('book');
        res.render('bookinstance/list', {title: 'Book instance lists', bookinstances});
    } catch (err){
        next(err);
    }
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = async function (req, res, next) {
    try {
      const bookinstance = await BookInstance.findById(req.params.id).populate('book');
      if (bookinstance) {
        res.render('bookinstance/detail', { title: bookinstance.book.name, bookinstance});
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
exports.bookinstance_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance create GET');
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance create POST');
};

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete POST');
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update POST');
};
