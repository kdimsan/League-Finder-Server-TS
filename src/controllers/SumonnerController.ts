import { Request, Response } from "express";

const SummonersServicesImport = require("../services/SummonerServices");
const summonerServices = new SummonersServicesImport("br1");

class SummonerController {
  async get(request: Request, response: Response) {
    summonerServices.get(request, response);
  }
}
module.exports = SummonerController;
