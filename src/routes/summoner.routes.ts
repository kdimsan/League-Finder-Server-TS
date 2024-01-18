const { Router: SummonerRouter } = require("express");

const SummonerControllerImport = require("../controllers/SumonnerController");

const summonerController = new SummonerControllerImport();

const summonerRoutes = SummonerRouter();

summonerRoutes.get("/", summonerController.get);

module.exports = summonerRoutes;
