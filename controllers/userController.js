const { body, validationResult } = require('express-validator');
const passport = require('passport');

const User = require('../models/user');
const {
  constants: { UserRole },
} = require('../config');

// Display detail page for a specific user.
exports.user_profile = [
  isPageOwnedByUser,

  async function (req, res, next) {
    try {
      const user = await User.findById(req.params.id);
      if (user) {
        // Successful, so render
        res.render('user/profile', {
          title: 'User Profile',
          user,
          UserRole,
        });
      } else {
        let err = new Error('User not found');
        err.status = 404;
        return next(err);
      }
    } catch (err) {
      next(err);
    }
  },
];

// Display login form on GET.
exports.login_get = [
  isAlreadyLoggedIn,

  function (req, res, next) {
    const messages = extractFlashMessages(req);
    res.render('user/login', {
      title: 'Login',
      messages,
    });
  },
];

// Display warning page on GET.
exports.warning = function (req, res, next) {
  res.send('NOT IMPLEMENT GET /user/stop');
};

// Handle login form on POST
exports.login_post = [
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/login',
    failureFlash: true,
  }),
];

// Handle logout on GET.
exports.logout_get = [
  function (req, res, next) {
    req.logout();
    req.session.destroy((err) => {
      res.redirect('/');
    });
  },
];

// Display register form on GET.
exports.register_get = [
  isAlreadyLoggedIn,

  function (req, res, next) {
    res.render('user/register', { title: 'Register', UserRole });
  },
];

// Handle register on POST.
exports.register_post = [
  // Validate fields.
  body('username', 'Username must be at least 3 characters long.')
    .isLength({ min: 3 })
    .trim()
    .custom(async (username) => {
      const user = await User.findOne({ username });
      if (user) {
        return Promise.reject('Username already taken. Choose another one.');
      }
    }),
  body('fullname', 'Full name must be at least 3 characters long.')
    .isLength({ min: 3 })
    .trim(),
  body('email', 'Please enter a valid email address.').isEmail().trim(),
  body('role', 'A role must be selected for the user.')
    .isLength({ min: 1 })
    .trim()
    .toInt()
    .isIn(UserRole.map((role) => role.value)),
  body('password', 'Password must be between 4-32 characters long.')
    .isLength({ min: 4, max: 32 })
    .trim(),
  body('password_confirm')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  // Sanitize fields with wildcard operator.
  body('*').trim().escape(),
  // Process request after validation and sanitization.
  async function (req, res, next) {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a user object with escaped and trimmed data.
    const user = new User({
      username: req.body.username,
      fullname: req.body.fullname,
      email: req.body.email,
      role: req.body.role,
    });

    if (!errors.isEmpty()) {
      res.render('user/register', {
        title: 'Register',
        user,
        UserRole,
        errors: errors.array(),
      });
    } else {
      user.setPassword(req.body.password);
      await user.save();
      // User saved. Redirect to login page.
      req.flash('success', 'Successfully registered. You can log in now!');
      res.redirect('/user/login');
    }
  },
];

// Display update form on GET.
exports.update_get = [
  isPageOwnedByUser,

  async function (req, res, next) {
    try {
      const user = await User.findById(req.params.id);
      if (user) {
        // Successful, so render
        res.render('user/update', {
          title: 'User update information',
          user,
          UserRole,
        });
      } else {
        let err = new Error('User not found');
        err.status = 404;
        return next(err);
      }
    } catch (err) {
      next(err);
    }
  },
];
// Handle update on POST.
exports.update_post = [
  // Validate fields.
  body('username', 'Username must be at least 3 characters long.')
    .isLength({ min: 3 })
    .trim()
    .custom(async (username, { req }) => {
      if (username !== req.user.username) {
        const user = await User.findOne({ username });
        if (user) {
          return Promise.reject(
            `Username ${username} already taken. Choose another one.`
          );
        }
      }
    }),
  body('fullname', 'Full name must be at least 3 characters long.')
    .isLength({ min: 3 })
    .trim(),
  body('email', 'Please enter a valid email address.').isEmail().trim(),
  body('role', 'A role must be selected for the user.')
    .isLength({ min: 1 })
    .trim()
    .toInt()
    .isIn(UserRole.map((role) => role.value)),
  body('password', 'Password must be between 4-32 characters long.')
    .optional({ checkFalsy: true })
    .isLength({ min: 4, max: 32 })
    .trim(),
  body('password_confirm')
    .trim()
    .custom((value, { req }) => {
      if (req.body.password && value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  // Sanitize fields with wildcard operator.
  body('*').trim().escape(),
  // Process request after validation and sanitization.
  async function (req, res, next) {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a user object with escaped and trimmed data and the old _id!
    const user = new User({
      username: req.body.username,
      fullname: req.body.fullname,
      email: req.body.email,
      role: req.body.role,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render('user/update', {
        title: 'User update info',
        user,
        UserRole,
        errors: errors.array(),
      });
    } else {
      if (req.body.password) {
        user.setPassword(req.body.password);
      }
      try {
        await User.findByIdAndUpdate(req.params.id, user);
        res.redirect(user.url);
      } catch (err) {
        next(err);
      }
    }
  },
];

// Display reset password form on GET.
exports.reset_get = function (req, res, next) {
  res.send('NOT IMPLEMENT get /user/reset ');
};

// Handle reset password on POST (1st step).
exports.reset_post = function (req, res, next) {
  res.send('NOT IMPLEMENT POST 1 /user/reset ');
};
// Handle reset password on POST (2nd step).
exports.reset_post_final = function (req, res, next) {
  res.send('NOT IMPLEMENT  POST 2 /user/reset ');
};

// -- Helper functions, no need to export. -- //

// Extract flash messages from req.flash and return an array of messages.
function extractFlashMessages(req) {
  const messages = [];
  // Check if flash messages was sent. If so, populate them.
  const errorFlash = req.flash('error');
  const successFlash = req.flash('success');

  // Look for error flash.
  if (errorFlash && errorFlash.length)
    messages.push({ type: 'error', msg: errorFlash[0] });

  // Look for success flash.
  if (successFlash && successFlash.length)
    messages.push({ type: 'success', msg: successFlash[0] });
  return messages;
}

// Function to prevent user who already logged in from
// accessing login and register routes.
function isAlreadyLoggedIn(req, res, next) {
  if (req.user && req.isAuthenticated()) {
    res.redirect('/');
  } else {
    next();
  }
}

// Function that confirms that user is logged in and is the 'owner' of the page.
function isPageOwnedByUser(req, res, next) {
  if (req.user && req.isAuthenticated()) {
    if (req.user._id.toString() === req.params.id.toString()) {
      // User's own page. Allow request.
      next();
    } else {
      // Deny and redirect.
      res.redirect('/');
    }
  } else {
    // Not authenticated. Redirect.
    res.redirect('/');
  }
}
