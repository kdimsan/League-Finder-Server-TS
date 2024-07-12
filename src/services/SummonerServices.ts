import { Request, Response } from "express";
import "dotenv/config";
const ChampionsUtil = require("../utils/ChampionsUtil");
import {
  SummonerByPuuid,
  SummonerMasteryChampionsApiRes,
  SummonerRankedData,
  SummonerResByGameName,
  SummonerResponseData,
  TopSummonerChampions,
} from "../@types/summoners/summonerResponse";

import axios from "axios";
import {
  InfoReturn,
  MatchResponse,
  MatchesDetailsReturn,
  ParticipantsReturn,
  Challenges,
  Participant,
  Team,
  TeamsResponse,
  SummonerMatchDataProps,
  ParticipantsFullReturnProps,
} from "../@types/matches/matchesTypes";
import {
  ChampionBase,
  ChampionData,
} from "../@types/champions/championsResponses";
import { regionsMapFn } from "../utils/functions/regionsMapFn";
import { queueDataFn } from "../utils/functions/queueDataFn";

interface SummonerQueryReq {
  gameName: string;
  tagLine: string;
}

class SummonersServices {
  constructor(private accountRegion: string) {}
  private readonly baseUrl = process.env.BASE_URL;
  private readonly KEY = process.env.API_KEY;
  private readonly rankedUrl = process.env.RANKED_URL;
  private readonly championMasteryUrl = process.env.CHAMPION_MASTERY_URL;
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
      const summonerResponseApi: SummonerResByGameName = (
        await axios.get(summonerDataByTagLineUrl)
      )["data"];

      const summonerPuuid = summonerResponseApi.puuid;

      const summonerDataByPuuidUrl = `https://${this.accountRegion}.${this.baseUrl}/${this.summonerDetailsUrl}/${summonerPuuid}?api_key=${this.KEY}`;
      const summonerDataByPuuidRes: SummonerByPuuid = (
        await axios.get(summonerDataByPuuidUrl)
      )["data"];

      const summonerResponseData: SummonerResponseData = {
        gameName: summonerResponseApi.gameName,
        tagLine: summonerResponseApi.tagLine,
        puuid: summonerPuuid,
        accountId: summonerDataByPuuidRes.accountId,
        id: summonerDataByPuuidRes.id,
        profileIconId: summonerDataByPuuidRes.profileIconId,
        revisionDate: summonerDataByPuuidRes.revisionDate,
        summonerLevel: summonerDataByPuuidRes.summonerLevel,
      };

      return summonerResponseData;
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
      const mainRegion = regionsMapFn(this.accountRegion);

      const matchesIdsUrl = `https://${mainRegion}.${this.baseUrl}/${this.matchesUrl}/${summonerPuiid}/ids?start=0&count=20&api_key=${this.KEY}`;
      const matchesIdsResponse: string[] = (await axios.get(matchesIdsUrl))
        .data;

      const matchesUrls: string[] = matchesIdsResponse.map(
        (matchId) =>
          `https://${mainRegion}.${this.baseUrl}/${this.matchByIdUrl}/${matchId}?api_key=${this.KEY}`
      );
      const matchesDetailsArray: MatchesDetailsReturn[] = [];

      for (const match of matchesUrls) {
        try {
          const response: MatchResponse = (await axios.get(match)).data;

          const participantsArray: ParticipantsFullReturnProps =
            this.participantsMapping(response.info.participants, summonerPuiid);

          const teamsArray: TeamsResponse[] = await this.teamsMapping(
            response.info.teams,
            participantsArray.returnParticipantsArray
          );

          const queueTypeResponse = queueDataFn(response.info.queueId);

          const matchInfoReturn: InfoReturn = {
            gameMode: response.info.gameMode,
            gameStartTimestamp: response.info.gameStartTimestamp,
            gameEndTimestamp: response.info.gameEndTimestamp,
            gameDuration: response.info.gameDuration,
            gameType: response.info.gameType,
            queueType: queueTypeResponse,
            searchSummonerData: participantsArray.summonerMatchData,
            participantsData: participantsArray.returnParticipantsArray,
            teams: teamsArray,
          };

          matchesDetailsArray.push({
            matchInfo: matchInfoReturn,
            participantsPuuid: response.metadata.participants,
          });
        } catch (err) {
          console.error(`Error retrieving match: ${match} ${err}`);
        }
      }
      return matchesDetailsArray;
    } catch (error: any) {
      return error;
    }
  }

  async getMasteryChampions(
    summonerPuuid: string
  ): Promise<TopSummonerChampions[]> {
    const summonerMasteryChampionsUrl = `https://${this.accountRegion}.${this.baseUrl}/${this.championMasteryUrl}/${summonerPuuid}?api_key=${this.KEY}`;

    try {
      const summonerMasteryResponse: SummonerMasteryChampionsApiRes[] = (
        await axios.get(summonerMasteryChampionsUrl)
      ).data;

      const summonerTopMasteryChampionsPromises: Promise<TopSummonerChampions>[] =
        summonerMasteryResponse.slice(0, 10).map(async (championKey) => {
          const championKeyToCompare = championKey.championId;
          const foundChampion: ChampionData =
            await ChampionsUtil.findChampionsByKey(championKeyToCompare);
          return {
            championKey: championKey.championId,
            championName: foundChampion.name,
            championId: foundChampion.id,
            championLevel: championKey.championLevel,
            championPoints: championKey.championPoints,
            lastPlayTime: championKey.lastPlayTime,
            chestGranted: championKey.chestGranted,
          };
        });
      const summonerTopMasteryChampions: TopSummonerChampions[] =
        await Promise.all(summonerTopMasteryChampionsPromises);
      return summonerTopMasteryChampions;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error("AxiosError:", error.message);
        if (error.response) {
          console.error("Response status:", error.response.status);
          console.error("Response data:", error.response.data);
          throw new Error(
            `Failed to fetch mastery champions: ${error.response.status} - ${error.response.data}`
          );
        } else if (error.request) {
          console.error("No response received:", error.request);
          throw new Error(
            "No response received from the server while fetching mastery champions."
          );
        } else {
          console.error("Axios error:", error.message);
          throw new Error(`Unexpected Axios error: ${error.message}`);
        }
      } else {
        console.error("Unexpected error:", error);
        throw new Error(`Unexpected error: ${error.message}`);
      }
    }
  }

  participantsMapping(participants: Participant[], summonerPuuid: string) {
    const returnParticipantsArray: ParticipantsReturn[] = [];
    let summonerMatchData: SummonerMatchDataProps | null = null;

    participants.forEach((participant) => {
      const primaryRune = participant.perks.styles[0].selections[0].perk;
      const secondaryRune = participant.perks.styles[1].style;
      const runes = {
        mainRune: primaryRune,
        secondaryRuneStyle: secondaryRune,
      };

      const userItemsArray = [
        participant.item0,
        participant.item1,
        participant.item2,
        participant.item3,
        participant.item4,
        participant.item5,
        participant.item6,
      ];

      const challengesReturn: Challenges = {
        goldPerMinute: participant.challenges.goldPerMinute,
        kda: participant.challenges.kda,
        killParticipation: participant.challenges.killParticipation,
        gameLength: participant.challenges.gameLength,
      };

      const totalFarm =
        participant.totalMinionsKilled + participant.neutralMinionsKilled;

      returnParticipantsArray.push({
        assists: participant.assists,
        challenges: challengesReturn,
        champLevel: participant.champLevel,
        championId: participant.championId,
        championName: participant.championName,
        deaths: participant.deaths,
        goldEarned: participant.goldEarned,
        individualPosition: participant.individualPosition,
        kills: participant.kills,
        lane: participant.lane,
        neutralMinionsKilled: participant.neutralMinionsKilled,
        perks: runes,
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
        teamPosition: participant.teamPosition,
        totalDamageDealtToChampions: participant.totalDamageDealtToChampions,
        totalDamageTaken: participant.totalDamageTaken,
        totalMinionsKilled: participant.totalMinionsKilled,
        totalFarm: totalFarm,
        items: userItemsArray,
        visionScore: participant.visionScore,
        wardsKilled: participant.wardsKilled,
        wardsPlaced: participant.wardsPlaced,
        win: participant.win,
      });

      if (participant.puuid === summonerPuuid) {
        const support =
          participant.teamPosition === "UTILITY"
            ? "SUPPORT"
            : participant.teamPosition;
        summonerMatchData = {
          puiid: participant.puuid,
          championName: participant.championName,
          win: participant.win,
          lane: participant.lane,
          role: support,
          teamId: participant.teamId,
        };
      }
    });
    const participantsWithSummonerData: ParticipantsFullReturnProps = {
      summonerMatchData: summonerMatchData,
      returnParticipantsArray: returnParticipantsArray,
    };

    return participantsWithSummonerData;
  }

  async teamsMapping(teams: Team[], participantsMapped: ParticipantsReturn[]) {
    const teamData = await Promise.all(
      teams.map(async (team) => {
        const teamBansPromise: ChampionBase[] = await Promise.all(
          team.bans.map(async (championKey) => {
            const champion: ChampionData =
              await ChampionsUtil.findChampionsByKey(championKey.championId);
            return {
              championName: champion.name,
              championId: champion.id,
              championKey: championKey.championId,
            };
          })
        );
        const teamBans = await Promise.all(teamBansPromise);

        const teamParticipants: ParticipantsReturn[] = [];

        participantsMapped.map((participant) => {
          if (participant.teamId !== team.teamId) {
            return;
          }
          return teamParticipants.push(participant);
        });

        const matchGoldByTeam = teamParticipants.reduce(
          (acc, value) => acc + value.goldEarned,
          0
        );
        const matchDamageDealtByTeam = teamParticipants.reduce(
          (acc, value) => acc + value.totalDamageDealtToChampions,
          0
        );
        const matchDamageTakenByTeam = teamParticipants.reduce(
          (acc, value) => acc + value.totalDamageTaken,
          0
        );
        const wardsPlacedByTeam = teamParticipants.reduce(
          (acc, value) => acc + value.wardsPlaced,
          0
        );
        const farmByTeam = teamParticipants.reduce(
          (acc, value) => acc + value.totalFarm,
          0
        );

        const objectives = {
          baron: team.objectives.baron.kills,
          champion: team.objectives.champion.kills,
          dragon: team.objectives.dragon.kills,
          horde: team.objectives.horde.kills,
          inhibitor: team.objectives.inhibitor.kills,
          riftHerald: team.objectives.riftHerald.kills,
          tower: team.objectives.tower.kills,
          totalGold: matchGoldByTeam,
          damageDealt: matchDamageDealtByTeam,
          damageTaken: matchDamageTakenByTeam,
          totalFarm: farmByTeam,
          totalWards: wardsPlacedByTeam,
        };

        return {
          bans: teamBans,
          objectives: objectives,
          teamId: team.teamId,
          win: team.win,
        };
      })
    );
    return teamData;
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

    const summonerMasteryChampionsData = await this.getMasteryChampions(
      summonerData.puuid
    );

    if (summonerMasteryChampionsData instanceof Error) {
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
      summonerMasteryChampionsData,
      summonerLatestMatchesData,
    });
  }
}

module.exports = SummonersServices;
