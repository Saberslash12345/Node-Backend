const router = require('express').Router();
const productController = require('../controller/productController');


router.get("/", productController.getAll)
  .post("/", productController.post)
  .put("/:id", productController.put)
  .delete("/:id", productController.remove);
module.exports = router;
