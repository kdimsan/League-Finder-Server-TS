require("dotenv/config");
const ChampionsUtil = require("../utils/ChampionsUtil");
import { Request, Response } from "express";
import axios from "axios";
import { ChampionData } from "../@types/champions/championsResponses";
import { FreeWeekRes } from "../@types/freeWeek/freeWeekTypes";

class FreeWeekServices {
  private readonly KEY = process.env.API_KEY;
  private readonly CURRENT_PATCH = process.env.CURRENT_PATCH;
  private readonly BASE_URL = process.env.BASE_URL;
  private readonly FREE_ROTATION_URL = process.env.FREE_ROTATION_URL;
  private language = "en_US";
  private readonly championsUrl = `https://ddragon.leagueoflegends.com/cdn/${this.CURRENT_PATCH}/data/${this.language}/champion.json`;
  private readonly freeWeekUrl = `https://br1.${this.BASE_URL}/${this.FREE_ROTATION_URL}?api_key=${this.KEY}`;

  async get(request: Request, response: Response) {
    try {
      const championsRes: ChampionData = (await axios.get(this.championsUrl))
        .data.data;

      const freeWeekRes: FreeWeekRes = (await axios.get(this.freeWeekUrl)).data;
      const freeWeekChampionIds: number[] = freeWeekRes.freeChampionIds;

      const freeWeekChampionsDataPromises = freeWeekChampionIds.map(
        async (key) => {
          return await ChampionsUtil.findChampionsByKey(key);
        }
      );

      const freeWeekChampionsData: ChampionData[] = await Promise.all(
        freeWeekChampionsDataPromises
      );

      const allChampionsRes: ChampionData[] = Object.values(championsRes);

      return response.json({
        freeWeekChampionsData,
        allChampionsRes,
      });
    } catch (error) {
      console.error("Error fetching free week data.", error);
      return response
        .status(500)
        .json({ error: "Error fetching free week data." });
    }
  }
}

module.exports = FreeWeekServices;
