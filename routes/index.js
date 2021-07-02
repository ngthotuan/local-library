const siteRouter = require('./site');
const catalogRouter = require('./catalog');
const userRouter = require('./user');

module.exports = (app) => {
  app.use('/', siteRouter);
  app.use('/catalog', catalogRouter);
  app.use('/user', userRouter);
};
