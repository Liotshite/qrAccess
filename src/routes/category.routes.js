const express = require('express');
const router = express.Router();
const catController = require("../controllers/api.category.controller");
const authMiddleware = require('../middleware/authMiddleware');


// list categories
router.get("/cats", authMiddleware, catController.renderCats);


// create cat
router.post("/createCat", authMiddleware, catController.createCat);


// delete cat
router.delete("/deleteCat/:id", authMiddleware, catController.deletecat);

module.exports = router;

