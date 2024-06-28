import { SummonerByPuuid } from "./../@types/summoners/summonerResponse";
require("dotenv/config");
import { Request, Response } from "express";
import axios from "axios";
import { RankedResponses } from "../@types/rankedRoute/rankedResponses";
import {
  ChampionDetails,
  ChampionDetailsRequestProps,
} from "../@types/champions/championsResponses";

interface ChampionDetailsReq {
  championName: string;
}

class ChampionDetailsServices {
  private readonly baseUrl = process.env.BASE_URL;
  private readonly API_KEY = process.env.API_KEY;
  private readonly MATCH_URL = process.env.MATCHES_URL;

  async getSummonersPuuid() {
    try {
      const challengersUrl = `https://br1.${this.baseUrl}/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5?api_key=${this.API_KEY}`;
      const challengersSummonersResponse: RankedResponses = (
        await axios.get(challengersUrl)
      ).data;
      const challengersSummonersId = challengersSummonersResponse.entries.map(
        (summoner) => summoner.summonerId
      );
      const challengersPuuidPromises = challengersSummonersId.map(
        async (summonerId) => {
          const summonerPuuidBySummonerIdUrl = `https://br1.${this.baseUrl}/lol/summoner/v4/summoners/${summonerId}?api_key=${this.API_KEY}`;
          const summonerPuuid: SummonerByPuuid = (
            await axios.get(summonerPuuidBySummonerIdUrl)
          ).data;
          return summonerPuuid.puuid;
        }
      );
      const challengersPuuid = await Promise.all(challengersPuuidPromises);
      return challengersPuuid;
    } catch (error) {
      console.error("Error getting PUUIDs:", error);
      throw error;
    }
  }

  async getMatchesId(summonerPuuid: string) {
    try {
      const summonerLastMatchesUrl = `https://americas.${this.baseUrl}/${this.MATCH_URL}/${summonerPuuid}/ids?start=0&count=20&api_key=${this.API_KEY}`;
      const response: Promise<string[]> = (
        await axios.get(summonerLastMatchesUrl)
      ).data;
      return response;
    } catch (error) {
      console.error("Error getting matches IDs:", error);
      throw error;
    }
  }

  async post(request: Request, response: Response) {
    const { championName }: ChampionDetailsReq = request.body;
    const championDetailsUrl = `https://ddragon.leagueoflegends.com/cdn/14.12.1/data/en_US/champion/${championName}.json`;
    const championDetails: ChampionDetailsRequestProps = (
      await axios.get(championDetailsUrl)
    ).data.data;

    const championDetail: ChampionDetails = championDetails[championName];

    const spellsWithPassive = [
      {
        id: championDetail.passive.name,
        name: championDetail.passive.name,
        description: championDetail.passive.description,
        image: championDetail.passive.image,
      },
      ...championDetail.spells,
    ];

    const championDetailsResponse = {
      id: championDetail.id,
      key: championDetail.key,
      name: championDetail.name,
      title: championDetail.title,
      image: championDetail.image,
      skins: championDetail.skins,
      lore: championDetail.lore,
      blurb: championDetail.blurb,
      allytips: championDetail.allytips,
      enemytips: championDetail.enemytips,
      tags: championDetail.tags,
      partype: championDetail.partype,
      info: championDetail.info,
      stats: championDetail.stats,
      spells: spellsWithPassive,
    };

    // const challengersPuuid = await this.getSummonersPuuid();
    // const uniqueMatch = new Set();

    // for (const summonerPuuid of challengersPuuid) {
    //   const matchesIDs = await this.getMatchesId(summonerPuuid);
    //   for (const matchId of matchesIDs) {
    //     uniqueMatch.add(matchId);
    //   }
    // }
    // console.log(Array.from(uniqueMatch));

    return response.json(championDetailsResponse);
  }
}
module.exports = ChampionDetailsServices;
