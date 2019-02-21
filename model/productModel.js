const autoIncrement = require("mongodb-autoincrement");

function load(req) {
  let response = new Promise(function (resolve, reject) {
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
      if (req.query.id && req.query.id != "" && !isNaN(req.query.id)) {
        query._id = parseInt(req.query.id);
      }
      if (req.query.name && req.query.name != "") {
        query.name = req.query.name;
      }
      if (req.query.category && req.query.category != "") {
        query.category = { $all: JSON.parse(req.query.category) };
      }
      let lookup = {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'category'
      }
      const db = require('../config/mongodb').db;
      db.collection('products').aggregate([
        {
          $match: query
        },
        {
          $lookup: lookup
        }
      ]).skip((pageNum - 1) * perPage).limit(perPage).toArray()
        .then(function (results) {
          resolve({ status: 200, data: results });
        }, function (err) {
          resolve({ status: 400, data: err.MongoError
           });
        });
    } catch (error) {
      reject(error)
    }

  })
  return response;
}

function save(req) {

  let response = new Promise(function (resolve, reject) {
    try {
      if (!req.body || !req.body.name || !req.body.description || !req.body.category || !req.body.quantity || isNaN(req.body.quantity) ) {
        resolve({ status: 400, data: "product data is not complete :)" })
      }
      else {
        let name = req.body.name.toLowerCase();
        let description = req.body.description.toLowerCase();
        let category;
        if(typeof category=="string"){
          category = JSON.parse(req.body.category);
        }else{
          category = req.body.category;
        }
        let quantity = parseInt(req.body.quantity);
        const db = require('../config/mongodb').db;
        let collection = db.collection('products');
        collection.find({ name: name }).toArray()
          .then(function (products) {
            if (products.length == 0) {
              autoIncrement.getNextSequence(db, 'products', function (err, autoIndex) {
                let product = {
                  _id: autoIndex,
                  name: name,
                  description: description,
                  category: category,
                  quantity: quantity
                }
                collection.insertOne(product)
                  .then(function (result) {
                    resolve({
                      status: 200, data: {
                        data: {
                          message: "Product successfully stored into database."
                        },
                        resource: [product]
                      }
                    });
                  }, function (err) {
                    resolve({
                      status: 400, data: {
                        "message": err.MongoError
                      }
                    });
                  });
              });
            } else {
              resolve({ status: 400, data: { "message": "product with same name exists!" } });
            }
          })

      }
    } catch (err) {
      reject(err)
    }
  });
  return response;
}
function edit(req) {

  let response = new Promise(function (resolve, reject) {
    if (!req.body || !req.body.name || !req.body.description || !req.body.category || !req.body.quantity || !req.params.id || isNaN(req.params.id) || isNaN(req.body.quantity)) {
      resolve({ status: 400, data: "product data is not complete :)" })
    } else {
      try {
        let id = parseInt(req.params.id);
        let name = req.body.name.toLowerCase();
        let description = req.body.description.toLowerCase();
        let category;
        if(typeof category=="string"){
          category = JSON.parse(req.body.category);
        }else{
          category = req.body.category;
        }
        let quantity = parseInt(req.body.quantity);
        let query = { _id: id };
        let modifiedProduct = {
          name: name,
          description: description,
          category: category,
          quantity: quantity
        }
        const db = require('../config/mongodb').db;
        db.collection('products').findOneAndUpdate(query, { $set: modifiedProduct }, { returnNewDocument: true })
          .then(function (doc) {
            if (doc.value == null) {
              resolve({
                status: 400, "data": {
                  "message": "Product was not found in database."
                }
              })

            }
            else {
              resolve({
                status: 200, "data": {
                  "message": "Product successfully updated in database."
                }
              })
            }

          }, function (err) {
            resolve({
              status: 400, data: {
                "message": err.MongoError
              }
            })
          })
      } catch (error) {
        reject(err)
      }
    }
  })
  return response;

}
function remove(req) {
  let response = new Promise(function (resolve, reject) {
    if (!req.params || !req.params.id || isNaN(req.params.id)) {
      resolve({ status: 400, data: "product id not valid" });
    } else {
      try {
        const db = require('../config/mongodb').db;
        let id = parseInt(req.params.id);
        let query = { _id: id };
        db.collection('products').remove(query)
          .then(function () {
            resolve({ status: 204, data: null })
          }, function (err) {
            resolve({
              status: 400, data: {
                "message": err.MongoError
              }
            })
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
  edit,
  remove
}

