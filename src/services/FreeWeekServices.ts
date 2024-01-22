require("dotenv/config");
import { Request, Response } from "express";
import axios from "axios";
import { ChampionData } from "../@types/champions/championsResponses";
import { FreeWeekRes } from "../@types/freeWeek/freeWeekTypes";

class FreeWeekController {
  private readonly KEY = process.env.API_KEY;
  private readonly CURRENT_PATCH = process.env.CURRENT_PATCH;
  private readonly BASE_URL = process.env.BASE_URL;
  private readonly FREE_ROTATION_URL = process.env.FREE_ROTATION_URL;
  private language = "en_US";
  private readonly championsUrl = `https://ddragon.leagueoflegends.com/cdn/${this.CURRENT_PATCH}/data/${this.language}/champion.json`;
  private readonly freeWeekUrl = `https://br1.${this.BASE_URL}/${this.FREE_ROTATION_URL}?api_key=${this.KEY}`;

  async get(request: Request, response: Response) {
    const championsRes: ChampionData = (await axios.get(this.championsUrl)).data
      .data;

    const freeWeekRes: FreeWeekRes = (await axios.get(this.freeWeekUrl)).data;

    const freeWeekChampionsData = findChampionsByKey(
      freeWeekRes.freeChampionIds
    );

    function findChampionsByKey(keys: number[]) {
      const allChampions: ChampionData[] = Object.values(championsRes);
      const foundChampions: ChampionData[] = [];

      keys.forEach((key) =>
        allChampions.forEach((champion) => {
          if (Number(champion.key) === key) {
            foundChampions.push(champion);
          }
        })
      );
      return foundChampions;
    }

    return response.json({
      freeWeekChampionsData,
    });
  }
}

module.exports = FreeWeekController;
