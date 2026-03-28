const express = require("express");
const router = express.Router();
const exportController = require("../controllers/api.export.controller");
const authenticateToken = require("../middleware/authMiddleware");


// All export routes protected by authentication
router.use(authenticateToken);

router.get("/csv", exportController.exportScansCSV);
router.get("/pdf", exportController.exportScansPDF);

module.exports = router;
