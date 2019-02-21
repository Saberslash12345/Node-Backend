const router = require('express').Router();
const userController = require('../controller/userController');

router.post("/authenticateuser", userController.login);
module.exports = router;