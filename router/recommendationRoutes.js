const express = require("express");
const router = express.Router();
const recommendationController = require("../controller/recommendationController");
//routes for recommendation 
//api link with frontend 

router.post("/generate", recommendationController.generateRecommendation);

module.exports = router;
