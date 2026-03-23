const express = require('express');
const router = express.Router();
const areaController = require('../controllers/api.area.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', areaController.getAreas);
router.get('/:id', areaController.getAreaById);
router.post('/', areaController.createArea);
router.put('/:id', areaController.updateArea);
router.delete('/:id', areaController.deleteArea);

module.exports = router;
