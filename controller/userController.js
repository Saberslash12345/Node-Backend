const userModel = require('../model/userModel');
const functions = require('../config/functions')
const jwt = require('jsonwebtoken');
const sha526 = require('crypto-js').sha526;

function getAll(req, res) {
  try {
    let perPage;
    let pageNum;
    if (!req.query.perPage || !req.query.pageNum || isNaN(req.query.perPage) || isNaN(req.query.pageNum)) {
      perPage = 10;
      pageNum = 1;
    }
    else {
      perPage = parseInt(req.query.perPage);
      pageNum = parseInt(req.query.pageNum);
    }

    let query = {};
    if (req.query.userName && req.query.userName != "") {
      query = { userName: req.query.userName }
    }
    let options = {
      page: pageNum,
      limit: perPage
    }
    userModel.paginate(query, options).then(function (results) {
      res.send({ data: results.docs })
    }, function (err) {
      res.status(400).send(err.MongoError);
    })
  } catch (err) {
    res.end(err)
  }

}
function getByUsername(req, res) {
  if (!req.params || !req.params.username) {
    return res.status("400").send("username is not valid!!")
  }
  try {
    let username = req.params.username.toLowerCase();
    userModel.findOne({
      "userName": username
    }).then(function (results) {
      res.send(results)
    }, function (err) {
      res.status(400).send(err.MongoError);
    })
  } catch (error) {
    res.status(500).send(error);
  }

}

function post(req, res) {
  if (!req.body || !req.body.userName || !req.body.email || !req.body.status || !req.body.password || !req.body.roles) {
    return res.status(400).send("user data is not complete :)");
  }
  try {
    let userName = req.body.userName.toLowerCase();
    let email = req.body.email.toLowerCase();
    let status = req.body.status.toLowerCase();
    let password = req.body.password.toLowerCase();
    let roles = req.body.roles;
    let user = new userModel({
      email: email,
      userName: userName,
      password: password,
      status: status,
      roles: roles
    })
    user.save().then(
      (doc) => {
        res.send({
          "data": {
            "message": "User successfuly created."
          }
        });
      }, (e) => {
        console.log(e);
        res.status(400).send(e.MongoError);
      })
  } catch (error) {
    res.status(500).send(error);
  }

}
function put(req, res) {
  if (!req.body || !req.body.email || !req.body.status || !req.body.roles || !req.params.userName) {
    return res.status(400).send("user data is not complete :)");
  }
  try {
    let email = req.body.email.toLowerCase();
    let status = req.body.status.toLowerCase();
    let roles = req.body.roles;
    let query = {
      "userName": req.params.userName
    }
    editedUser = {
      email: email,
      status: status,
      roles: roles
    };
    userModel.findOneAndUpdate(query, { $set: editedUser }).then(
      (doc) => {
        if (!doc) {
          res.send({
            "data": {
              "message": "Product is not found in database."
            }
          })
        } else {
          res.send({
            "data": {
              "message": "Product successfully updated in database."
            }
          })
        }

      }, (e) => {
        console.log(e);
        res.status(500).send(e.MongoError);
      })

  } catch (error) {
    res.status(500).send(error);
  }

}
function remove(req, res) {
  if (!req.params || !req.params.userName) {
    return res.status(400).send("username is not valid :)");
  }
  try {
    userModel.deleteOne({
      "userName": req.params.userName.toLowerCase()
    }).then(function () {
      res.send({
        "data": {
          "message": "User successfuly deleted."
        }
      })
    }, function (err) {
      res.status(400).send(err.MongoError);
    })
  } catch (error) {
    res.status(500).send(error);
  }

}
function login(req, res) {
  try {
    if (!req.body || !req.body.userName || !req.body.password) {
      return res.status(500).send("username or password is not valid :)");
    }
    let secretkey = functions.secretKey();
    userName = req.body.userName.toLowerCase();
    password = req.body.password.toLowerCase();
    let query = { userName: userName, password: password, status: "ACTIVE" }
    userModel.findOne(query).then(function (user) {
      if (user) {
        var token = jwt.sign({
          _id: user._id,
          username: user.username,
          roles: user.roles
        }, secretkey);
        res.send({
          data: {
            token: token,
            message: "Token is succesfully created.",
            code: 200
          }
        })
      } else {
        res.status(403).send("Not allowed!!!")
      }

    }, function (err) {
      res.status(500).send(err.MongoError);
    })
  } catch (err) {
    res.status(500).send(err);
  }

}


module.exports = { getAll, getByUsername, post, put, remove, login };