const express = require("express");
const router = express.Router();
const agentController = require("../controllers/api.agent.controller");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Toute la gestion des agents nécessite d'être connecté
router.use(authMiddleware);

// Seuls les admins peuvent gérer les agents
router.use(roleMiddleware(["SUPER_ADMIN", "ORG_ADMIN"]));

router.get("/", agentController.getAgents);
router.post("/", agentController.addAgent);
router.put("/:id/toggle", agentController.toggleAgentStatus);

module.exports = router;
