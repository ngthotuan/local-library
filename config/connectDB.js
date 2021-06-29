const mongoose = require('mongoose');
require('dotenv').config();

module.exports = async () => {
  const messageId = setInterval(() => {
    console.log('Connecting to database...');
  }, 500);
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      serverSelectionTimeoutMS: 10000,
    });
    clearInterval(messageId);
    console.log('Connected database successfully!');
  } catch (e) {
    clearInterval(messageId);
    console.log('Connect to database failure!');
    console.log(e.message);
  }
};
