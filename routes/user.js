const router = require('express').Router();
const userController = require('../controller/userController');

router.get("/", userController.getAll)
  .get("/:userName", userController.getByUsername)
  .post("/", userController.post)
  .put("/:userName", userController.put)
  .delete("/:userName", function (req, res) {
  userController.remove(req, res);

});
module.exports = router;
