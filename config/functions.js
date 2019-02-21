const jwt = require('jsonwebtoken');
function time() {
  var fullDate = new Date();
  var totalSec = new Date().getTime() / 1000 + 7200;
  var hours = parseInt(totalSec / 3600) % 24;
  var minutes = parseInt(totalSec / 60) % 60;
  var seconds = Math.floor(totalSec) % 60;
  var time = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
  var day = fullDate.getDate();
  var month = fullDate.getMonth() + 1;
  var year = fullDate.getFullYear();
  return (day < 10 ? "0" + day : day) + "-" + (month < 10 ? "0" + month : month) + "-" + year + ' ' + time + ' - ';
}
function auth(req, res, next) {
  let token = req.headers.token;
  let secret = secretKey();
  let decoded = jwt.decode(token, secret);
  if (decoded != null || req.path == '/auth/authenticateuser') {
    next();

  } else {
    res.status(403).send("NOT ALLOWED");
  }


}
function secretKey() {
  return "magicnasifra";
}
module.exports = { time, auth, secretKey }