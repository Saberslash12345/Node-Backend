var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;



var purchaseSchema = new Schema({

  userName: { type: String, required: true },
  productId: { type: Number, required: true },
  quantity: { type: Number, required: true },
  purchaseDate: { type: Date, required: true },
});
purchaseSchema.plugin(mongoosePaginate);

var Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;

