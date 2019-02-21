const productModel = require('../model/productModel');

async function getAll(req, res) {
  try {
    let response = await productModel.load(req);
    res.status(response.status).send(response.data);
  } catch (err) {
    console.log(err);
    res.end("err");
  }

}

async function post(req, res) {
  try {
    let response = await productModel.save(req);
    res.status(response.status).send(response.data);
  } catch (err) {
    console.log(err)
    res.end("err");
  }


}
async function put(req, res) {
  try {
    let response = await productModel.edit(req);
    res.status(response.status).send(response.data);
  } catch (err) {
    res.end("err");
  }


}
async function remove(req, res) {
  try {
    let response = await productModel.remove(req);
    if (response.status == null) {
      res.status(response.status).send();
    } else {
      res.status(response.status).send(response.data);
    }

  } catch (err) {
    res.end(err);
  }

}

module.exports = { getAll, post, put, remove };