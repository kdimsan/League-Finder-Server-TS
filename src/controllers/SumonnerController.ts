const { Request: RequestParam, Response: ResponseApi } = require("express");

const SummonersServicesImport = require("../services/SummonerServices");
const summonerServices = new SummonersServicesImport("br1");

class SummonerController {
  async get(request: typeof RequestParam, response: typeof ResponseApi) {
    summonerServices.get(request, response);
  }
}
module.exports = SummonerController;
