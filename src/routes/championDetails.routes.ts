const { Router: ChampionDetailsRoute } = require("express");

const ChampionDetailsController = require("../controllers/ChampionDetailsController");

const championDetailsController = new ChampionDetailsController();

const championDetailsRoutes = ChampionDetailsRoute();

championDetailsRoutes.post("/", championDetailsController.post);

module.exports = championDetailsRoutes;
