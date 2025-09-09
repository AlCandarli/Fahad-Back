const express = require("express");
const router = express.Router();
const usersController = require('../controllers/usersController');

router.route("/").get(usersController.getAllUsers);
router.route("/today").get(usersController.getTodaysUsers);
router.route("/download").get(usersController.downloadTodaysUsers);

module.exports = router;