require("dotenv/config");
import { Request, Response } from "express";
import axios from "axios";

interface ChampionDetailsReq {
  championName: string;
}

class ChampionDetailsServices {
  async post(request: Request, response: Response) {
    const { championName }: ChampionDetailsReq = request.body;
    const championDetailsUrl = `https://ddragon.leagueoflegends.com/cdn/13.23.1/data/en_US/champion/${championName}.json`;

    const championDetails = (await axios.get(championDetailsUrl)).data.data;

    return response.json({ championDetails });
  }
}
module.exports = ChampionDetailsServices;
