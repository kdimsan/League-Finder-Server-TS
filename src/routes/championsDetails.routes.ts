const { Router: ChampionsDetailsRoute } = require("express");

const ChampionsDetailsController = require("../controllers/ChampionsDetailsController");

const championsDetailsController = new ChampionsDetailsController();

const championsDetailsRoutes = ChampionsDetailsRoute();

championsDetailsRoutes.post("/", championsDetailsController.post);

module.exports = championsDetailsRoutes;
