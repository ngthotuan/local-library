module.exports = (app) => {
    app.use('/', require('./site'));
    app.use('/catalog', require('./catalog'));
};
