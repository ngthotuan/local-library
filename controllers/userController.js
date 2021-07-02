// Display detail page for a specific user.
exports.user_profile = function (req, res, next) {
  res.send('NOT IMPLEMENT GET /user/:id' + req.params.id);
};

// Display login form on GET.
exports.login_get = function (req, res, next) {
  res.send('NOT IMPLEMENT GET /user/login');
};

// Display warning page on GET.
exports.warning = function (req, res, next) {
  res.send('NOT IMPLEMENT GET /user/stop');
};

// Handle login form on POST
exports.login_post = function (req, res, next) {
  res.send('NOT IMPLEMENT POST /user/login');
};

// Handle logout on GET.
exports.logout_get = function (req, res, next) {
  res.send('NOT IMPLEMENT GET /user/logout');
};

// Display register form on GET.
exports.register_get = function (req, res, next) {
  res.send('NOT IMPLEMENT GET /user/register');
};

// Handle register on POST.
exports.register_post = function (req, res, next) {
  res.send('NOT IMPLEMENT POST /user/register');
};

// Display update form on GET.
exports.update_get = function (req, res, next) {
  res.send('NOT IMPLEMENT GET /user/update ' + req.params.id);
};
// Handle update on POST.
exports.update_post = function (req, res, next) {
  res.send('NOT IMPLEMENT POST /user/update ' + req.params.id);
};

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

// router.get('/stop', userController.warning);
