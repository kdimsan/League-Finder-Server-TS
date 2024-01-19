const { Router: FreeWeekRoute } = require("express");

const FreeWeekControllerImport = require("../controllers/FreeWeekController");

const freeWeekController = new FreeWeekControllerImport();

const freeWeekRoutes = FreeWeekRoute();

freeWeekRoutes.get("/", freeWeekController.get);

module.exports = freeWeekRoutes;
