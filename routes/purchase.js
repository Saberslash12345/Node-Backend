const router = require('express').Router();
const purchaseController = require("../controller/purchaseController");

router.get("/", purchaseController.getAll)
  .post("/", purchaseController.post);
module.exports = router;
