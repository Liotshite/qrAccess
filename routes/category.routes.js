const express = require('express');
const router = express.Router();
const catController = require("../controllers/category.controller");
const authMiddleware = require('../middleware/authMiddleware');


// Page list categories
router.get("/cats", authMiddleware, catController.renderCats);


// Page creation
router.get("/createCat", authMiddleware, catController.renderCreateCat);

router.post("/createCat", authMiddleware, catController.createCat);



module.exports = router;

