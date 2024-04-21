const express = require("express");
const router = express.Router();
const recommendationController = require("../controller/recommendationController");
//routes for recommendation

router.post("/generate", recommendationController.generateRecommendation);

module.exports = router;
