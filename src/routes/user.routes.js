const express = require('express');
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.static("public"));
const userController = require("../controllers/api.user.controller");
const authMiddleware = require('../middleware/authMiddleware');


// Login submit
router.post("/login", userController.login);


// SignIn submit
router.post('/signin', userController.signin);



// Page profile
router.get("/profile", authMiddleware, userController.viewprofile);
// Page log out
router.get("/logout", authMiddleware, userController.logout);




module.exports = router;