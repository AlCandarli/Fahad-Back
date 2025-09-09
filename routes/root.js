const express = require("express");
const router =express.Router();
const path = require("path");
const usersController = require('../controllers/usersController');


router.get("/" , (req,res)=>{
    res.sendFile(path.join(__dirname, "..","views","index.html"));
});

router.get("/data", usersController.getAllUsers);
router.delete("/delete/:id", usersController.deleteUser);



module.exports = router;