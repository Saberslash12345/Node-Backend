const router = require('express').Router();
const categoryController = require('../controller/categoryController');


router.get("/", categoryController.getAll)
  .post("/", categoryController.post)
  .delete("/:id", categoryController.remove);
module.exports = router;