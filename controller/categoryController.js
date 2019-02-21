const categoryModel = require('../model/categoryModel');


async function getAll(req, res) {
  try {
    let response = await categoryModel.load(req);
    res.status(response.status).send(response.data);
  } catch (err) {
    console.log(err)
    res.status(400).send('err');
  }

}

async function post(req, res) {
  try {
    let response = await categoryModel.save(req);
    res.status(response.status).send(response.data);
  } catch (err) {
    console.log(err)
    res.status(400).send('err');
  }


}
async function remove(req, res) {
  try {
    let response = await categoryModel.remove(req);
    if (response.status == null) {
      res.status(response.status).send();
    } else {
      res.status(response.status).send(response.data);
    }

  } catch (err) {
    console.log(err)
    res.status(400).send('err');
  }

}

module.exports = { getAll, post, remove };