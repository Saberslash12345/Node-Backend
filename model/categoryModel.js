const autoIncrement = require("mongodb-autoincrement");

function load(req) {

  let response = new Promise(function (resolve, reject) {
    try {
      let query = {};
      if (req.query && req.query.name != "" && req.query.name) {
        query.name = req.query.name.toLowerCase();
      }
      const db = require('../config/mongodb').db;
      db.collection('categories').find(query).toArray()
        .then(function (results) {
          resolve({ status: 200, data: results })
        }, function (err) {
          resolve({ status: 400, data: err.MongoErro })
        });
    } catch (error) {
      console.log(error)
      reject('error')
    }

  });
  return response;
}

function save(req) {
  let response = new Promise(function (resolve, reject) {
    try {
      if (!req.body || !req.body.name || !req.body.description) {
        resolve({ status: 400, data: "category data is not complete :)" })
      }
      else {
        let name = req.body.name.toLowerCase();
        let description = req.body.description.toLowerCase();
        const db = require('../config/mongodb').db;
        collection = db.collection('categories');
        db.collection('categories').find({ name: name }).toArray()
          .then(function (results) {
            if (results.length == 0) {
              autoIncrement.getNextSequence(db, 'categories', function (err, autoIndex) {
                if (err) {
                  resolve({ status: 400, data: err.MongoError })
                } else {
                  let category = {
                    _id: autoIndex,
                    name: name,
                    description: description
                  }

                  collection.insertOne(category)
                    .then(function (result) {
                      resolve({
                        status: 200, data: {
                          data: {
                            message: "Category successfully stored into database."
                          },
                          resource: [category]
                        }
                      });
                    }, function (err) {
                      resolve({ status: 400, data: err.MongoError });
                    })
                }

              });
            }
            else {
              resolve({ status: 400, data: { "message": "category with same name exists!" } });
            }
          }, function (err) {
            resolve({
              status: 400, data: {
                "message": err.MongoError
              }
            });
          });

      }

    } catch (err) {
      reject(err)
    }

  })
  return response;

}

function remove(req) {
  let response = new Promise(function (resolve, reject) {
    if (!req.params || !req.params.id || isNaN(req.params.id)) {
      resolve({ status: 400, data: "category id not valid" });
    } else {
      try {
        const db = require('../config/mongodb').db;
        let id = parseInt(req.params.id);
        let query = { _id: id };
        db.collection('categories').remove(query)
          .then(function () {
            resolve({ status: 204, data: null })
          }, function (err) {
            resolve({ status: 400, data: err.MongoError })
          })
      } catch (error) {
        reject(err)
      }
    }
  })
  return response;


}

module.exports = {
  load,
  save,
  remove
}

