const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookinstance');

exports.index = async function (req, res, next) {
    const names = ['Books', 'Copies', 'Copies Available', 'Authors', 'Genres'];
    try {
        const values = await Promise.all([
            Book.estimatedDocumentCount({}),
            BookInstance.estimatedDocumentCount(),
            BookInstance.countDocuments({status: 'Available'}),
            Author.estimatedDocumentCount(),
            Genre.estimatedDocumentCount(),
        ]);

        const data = names.map((name, index) => {
            return {
                name,
                value: values[index]
            }
        });
        res.render('index', {title: 'Local Library Home', data});

    } catch (err) {
        res.render('index', {title: 'Local Library Home', err});
    }
};

// Display list of all books.
exports.book_list = async function (req, res, next) {
    try {
        const books = await Book.find({}, 'title author').populate('author');
        res.render('book/list', {title: 'Book lists', books});
    } catch (err){
        next(err);
    }
};

// Display detail page for a specific book.
exports.book_detail = function (req, res) {
    res.send('NOT IMPLEMENTED: Book detail: ' + req.params.id);
};

// Display book create form on GET.
exports.book_create_get = function (req, res) {
    res.send('NOT IMPLEMENTED: Book create GET');
};

// Handle book create on POST.
exports.book_create_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Book create POST');
};

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
