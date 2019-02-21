const MongoClient = require('mongodb').MongoClient;
const colors = require('colors');
const functions = require('./functions');
//mongodb version 3.1
MongoClient.connect('mongodb://localhost:27017/nodeProject', { useNewUrlParser: true }, (err, client) => {
  if (err) {
    console.log(err);
    return null
  }
  console.log(functions.time() + "Mongo client is connected to port 27017".green);
  module.exports.db = client.db('nodeProject');

})
