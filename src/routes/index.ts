const { Router } = require("express");
const router = Router();

const summonerRoute = require("./summoner.routes");
const championDetailsRoute = require("./championDetails.routes");
const freeWeekRoute = require("./freeWeek.routes");

router.use("/summoner", summonerRoute);
router.use("/champion_details", championDetailsRoute);
router.use("/free_week", freeWeekRoute);

module.exports = router;
