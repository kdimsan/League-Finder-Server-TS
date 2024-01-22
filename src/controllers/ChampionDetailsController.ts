import { Request, Response } from "express";
const ChampionDetailsService = require("../services/ChampionDetailsServices");
const championDetailsService = new ChampionDetailsService();

class ChampionDetailsController {
  async post(request: Request, response: Response) {
    championDetailsService.post(request, response);
  }
}

module.exports = ChampionDetailsController;
