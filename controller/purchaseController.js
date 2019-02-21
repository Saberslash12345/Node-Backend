const purchaseModel = require('../model/purchaseModel');

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
      query.userName = req.query.userName;
    }
    if (req.query.productId && req.query.productId != "") {
      query.productId = req.query.productId;
    }
    let dateFrom;
    let dateTo;
    if (req.query.dateFrom && req.query.dateFrom != "") {
      dateFrom = req.query.dateFrom;
    }
    if (req.query.dateTo && req.query.dateTo != "") {

      dateTo = req.query.dateTo;
      query.purchaseDate = {
        $gt: new Date(dateFrom),
        $lt: new Date(dateTo)
      };

    }
    let options = {
      page: pageNum,
      limit: perPage
    }
    purchaseModel.paginate(query, options)
    .then(function (results) {
      res.send({ data: results.docs })
    }, function (err) {
      res.status(400).send(err.MongoError);
    })
  } catch (err) {
    res.end(err)
  }

}

function post(req, res) {
  if (!req.body || !req.body.userName || !req.body.purchaseDate || !req.body.productId || !req.body.quantity || isNaN(req.body.productId) || isNaN(req.body.quantity)) {
    return res.status(400).send("Purchase data is not complete :)");
  }
  try {
    let userName = req.body.userName.toLowerCase();
    let purchaseDate = req.body.purchaseDate;
    console.log(new Date(purchaseDate));
    let productId = parseInt(req.body.productId);
    let quantity = parseInt(req.body.quantity);
    let purchase = new purchaseModel({
      userName: userName,
      purchaseDate: purchaseDate,
      productId: productId,
      quantity: quantity
    })
    purchase.save().then(
      (doc) => {
        console.log(doc)
        res.send({
          "data": {
            "message": "Purchase successfuly made."
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

module.exports = { getAll, post };