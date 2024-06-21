import { Request, Response } from "express";

const SummonersServicesImport = require("../services/SummonerServices");

class SummonerController {
  async get(request: Request, response: Response) {
    const { accountRegion } = request.query;
    const summonerServices = new SummonersServicesImport(accountRegion);
    summonerServices.get(request, response);
  }
}

module.exports = SummonerController;
