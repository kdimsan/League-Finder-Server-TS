import { Request, Response } from "express";
const FreeWeekService = require("../services/FreeWeekServices");
const freeWeekService = new FreeWeekService();

class FreeWeekController {
  async get(request: Request, response: Response) {
    freeWeekService.get(request, response);
  }
}

module.exports = FreeWeekController;
