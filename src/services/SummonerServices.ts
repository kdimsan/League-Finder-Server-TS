import { Request, Response } from "express";
import "dotenv/config";
import {
  SummonerByPuuid,
  SummonerMaestryChampionsApiRes,
  SummonerRankedData,
  SummonerResponseData,
  TopSummonerChampions,
} from "../@types/summoners/summonerResponse";
import {
  AllChampionsRes,
  ChampionData,
} from "../@types/champions/championsResponses";

import axios from "axios";
import {
  InfoReturn,
  MatchResponse,
  MatchesDetailsReturn,
  ParticipantsReturn,
  Participant,
} from "../@types/matches/matchesTypes";

interface SummonerQueryReq {
  gameName: string;
  tagLine: string;
}

class SummonersServices {
  constructor(private accountRegion: string) {}
  //private accountRegion: string = "br1"
  private readonly baseUrl = process.env.BASE_URL;
  private readonly KEY = process.env.API_KEY;
  private readonly rankedUrl = process.env.RANKED_URL;
  private readonly championMaestryUrl = process.env.CHAMPION_MAESTRY_URL;
  private readonly baseSummonerUrl = process.env.BASE_SUMMONER_URL;
  private readonly summonerDetailsUrl = process.env.SUMMONER_DETAILS_URL;
  private readonly matchesUrl = process.env.MATCHES_URL;
  private readonly matchByIdUrl = process.env.MATCH_BY_ID_URL;

  async getSummonerData(
    gameName: string,
    tagLine: string
  ): Promise<SummonerByPuuid> {
    const summonerDataByTagLineUrl = `https://europe.${this.baseUrl}/${this.baseSummonerUrl}/${gameName}/${tagLine}?api_key=${this.KEY}`;

    try {
      const summonerResponseApi: SummonerResponseData = (
        await axios.get(summonerDataByTagLineUrl)
      )["data"];

      const summonerPuuid = summonerResponseApi.puuid;

      const summonerDataByPuuidUrl = `https://${this.accountRegion}.${this.baseUrl}/${this.summonerDetailsUrl}/${summonerPuuid}?api_key=${this.KEY}`;
      const summonerDataByPuuidRes: SummonerByPuuid = (
        await axios.get(summonerDataByPuuidUrl)
      )["data"];

      return summonerDataByPuuidRes;
    } catch (error: any) {
      return error;
    }
  }

  async getRankedData(summonerId: string): Promise<SummonerRankedData[]> {
    const summonerRankedDataUrl = `https://${this.accountRegion}.${this.baseUrl}/${this.rankedUrl}/${summonerId}?api_key=${this.KEY}`;

    try {
      const summonerRankedData: SummonerRankedData[] = (
        await axios.get(summonerRankedDataUrl)
      )["data"];

      return summonerRankedData.filter(
        (rankedType) => rankedType.queueType !== "CHERRY"
      );
    } catch (error: any) {
      return error;
    }
  }

  async getLatestMatches(
    summonerPuiid: string
  ): Promise<MatchesDetailsReturn[]> {
    try {
      const matchesIdsUrl = `https://americas.${this.baseUrl}/${this.matchesUrl}/${summonerPuiid}/ids?start=0&count=20&api_key=${this.KEY}`;
      const matchesResponse: string[] = (await axios.get(matchesIdsUrl)).data;

      const matchesUrls: string[] = matchesResponse.map(
        (matchUrl) =>
          `https://americas.${this.baseUrl}/${this.matchByIdUrl}/${matchUrl}?api_key=${this.KEY}`
      );
      const matchesDetailsArray: MatchesDetailsReturn[] = [];

      for (const match of matchesUrls) {
        try {
          const response: MatchResponse = (await axios.get(match)).data;

          const participantsArray: ParticipantsReturn[] =
            this.responseReestroctur(response.info.participants);
          const matchInfoReturn: InfoReturn = {
            gameMode: response.info.gameMode,
            gameStartTimestamp: response.info.gameStartTimestamp,
            gameDuration: response.info.gameDuration,
            gameType: response.info.gameType,
            participantsData: participantsArray,
            teams: response.info.teams,
          };

          matchesDetailsArray.push({
            matchInfo: matchInfoReturn,
            participantsPuuid: response.metadata.participants,
          });
        } catch (err) {
          console.error(`Error retrieving match: ${match}`);
        }
      }
      return matchesDetailsArray;
    } catch (error: any) {
      return error;
    }
  }
  responseReestroctur(responseInfo: Participant[]) {
    const returnArray: ParticipantsReturn[] = [];
    responseInfo.map((participant) => {
      const primaryRune = participant.perks.styles[0].selections[0].perk;
      const secondaryRune = participant.perks.styles[1].style;
      const runesArray = [primaryRune.toString(), secondaryRune.toString()];

      const userItemsArray = [
        participant.item0,
        participant.item1,
        participant.item2,
        participant.item3,
        participant.item4,
        participant.item5,
        participant.item6,
      ];

      return returnArray.push({
        assists: participant.assists,
        champLevel: participant.champLevel,
        championId: participant.championId,
        championName: participant.championName,
        deaths: participant.deaths,
        goldEarned: participant.goldEarned,
        kills: participant.kills,
        lane: participant.lane,
        neutralMinionsKilled: participant.neutralMinionsKilled,
        perks: runesArray,
        profileIcon: participant.profileIcon,
        puuid: participant.puuid,
        riotIdGameName: participant.riotIdGameName,
        riotIdTagline: participant.riotIdTagline,
        role: participant.role,
        summonerId: participant.summonerId,
        summonerSpell1: participant.summoner1Id,
        summonerSpell2: participant.summoner2Id,
        summonerLevel: participant.summonerLevel,
        teamId: participant.teamId,
        totalDamageDealtToChampions: participant.totalDamageDealtToChampions,
        totalDamageTaken: participant.totalDamageTaken,
        totalMinionsKilled: participant.totalMinionsKilled,
        items: userItemsArray,
        visionScore: participant.visionScore,
        wardsKilled: participant.wardsKilled,
        wardsPlaced: participant.wardsPlaced,
        win: participant.win,
      });
    });
    return returnArray;
  }

  async getMaestryChampions(
    summonerPuuid: string
  ): Promise<TopSummonerChampions[]> {
    const summonerMaestryChampionsUrl = `https://${this.accountRegion}.${this.baseUrl}/${this.championMaestryUrl}/${summonerPuuid}?api_key=${this.KEY}`;
    const allChampionsUrl =
      "https://ddragon.leagueoflegends.com/cdn/13.23.1/data/en_US/champion.json";

    try {
      const allChampionsRes: AllChampionsRes<ChampionData> = (
        await axios.get(allChampionsUrl)
      )["data"];
      const summonerMasteryResponse: SummonerMaestryChampionsApiRes[] = (
        await axios.get(summonerMaestryChampionsUrl)
      ).data;

      const summonerTopMaestryChampions: TopSummonerChampions[] =
        summonerMasteryResponse.slice(0, 10).map((championKey) => {
          const championKeyToCompare = championKey.championId.toString();
          const foundChampion = this.findChampionByKey(
            championKeyToCompare,
            allChampionsRes
          );

          return {
            championId: championKey.championId,
            championName: foundChampion,
            championLevel: championKey.championLevel,
            championPoints: championKey.championPoints,
            lastPlayTime: championKey.lastPlayTime,
            chestGranted: championKey.chestGranted,
          };
        });

      return summonerTopMaestryChampions;
    } catch (error: any) {
      return error;
    }
  }

  findChampionByKey(
    keyToCompare: string,
    allChampions: AllChampionsRes<ChampionData>
  ) {
    const champion = Object.values(allChampions.data).find(
      (champ) => champ.key === keyToCompare
    );
    return champion ? champion.name : "Champion not found";
  }

  async get(
    request: Request<{}, {}, {}, SummonerQueryReq>,
    response: Response
  ) {
    const { gameName, tagLine } = request.query;

    const summonerData = await this.getSummonerData(gameName, tagLine);

    if (summonerData instanceof Error) {
      return response
        .status(500)
        .json({ error: "Error retrieving summoner data" });
    }

    const summonerRankedData = await this.getRankedData(summonerData.id);

    if (summonerRankedData instanceof Error) {
      return response
        .status(500)
        .json({ error: "Error retrieving ranked data" });
    }

    const summonerMaestryChampionsData = await this.getMaestryChampions(
      summonerData.puuid
    );

    if (summonerMaestryChampionsData instanceof Error) {
      return response
        .status(500)
        .json({ error: "Error retrieving top mastery champions" });
    }

    const summonerLatestMatchesData = await this.getLatestMatches(
      summonerData.puuid
    );
    response.json({
      summonerData,
      summonerRankedData,
      summonerMaestryChampionsData,
      summonerLatestMatchesData,
    });
  }
}

module.exports = SummonersServices;
