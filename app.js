const app = require("express")();
const functions = require('./config/functions');
const bodyParser = require('body-parser');
const morgan = require("morgan");
const colors = require('colors');
const mongodb = require("./config/mongodb");
const mongoose = require("./config/mongoose");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
const user = require("./routes/user");
const login = require("./routes/login");
const product = require("./routes/product");
const category = require("./routes/category");
const purchase = require("./routes/purchase");


const port = 8000;

app.use(morgan(function (tokens, req, res) {

  return [
    functions.time(),
    tokens.method(req, res).yellow,
    tokens.url(req, res).split("?")[0].cyan,
    tokens.status(req, res).yellow,
    tokens['response-time'](req, res).magenta, 
    'ms'.grey
  ].join(' ')

}));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use("/store/auth", login);
app.use("/store/user", user);
app.use("/store/product", product)
app.use("/store/category", category);
app.use("/store/purchase", purchase);
app.listen(port, function (err) {
  if (err) console.log(err)
  console.log(functions.time() + ("Http server is listening on port " + port).green)
});



module.exports.app = app;

