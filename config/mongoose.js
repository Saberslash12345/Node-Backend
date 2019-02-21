const mongoose = require('mongoose');
const functions = require('./functions');
const colors = require('colors');

mongoose.Promise = global.Promise;
const url = "mongodb://localhost:27017/nodeProject";
const options = {
  useNewUrlParser: true,
  useCreateIndex: true
};
mongoose.connect(url, options)
  .catch(function (err) {
    console.log(err);
  })

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function () {
  console.log(functions.time() + "Mongoose is connected".green);
});

module.exports = mongoose;