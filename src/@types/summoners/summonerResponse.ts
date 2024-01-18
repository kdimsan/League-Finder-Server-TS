export interface SummonerResponseData {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface SummonerByPuuid {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIcon: number;
  revisionDate: number;
  summonerLevel: number;
}

export interface SummonerRankedData {
  leagueId: string;
  summonerId: string;
  summonerName: string;
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  hotStreak: boolean;
  veteran: boolean;
  freshBlood: boolean;
  inactive: boolean;
}

export interface SummonerMaestryChampionsApiRes {
  puuid: string;
  championId: number;
  championLevel: number;
  championPoints: number;
  lastPlayTime: number;
  championPointsSinceLastLevel: number;
  championPointsUntilNextLevel: number;
  chestGranted: boolean;
  tokensEarned: number;
  summonerId: string;
}

export interface TopSummonerChampions {
  championId: number;
  championName: string;
  championLevel: number;
  championPoints: number;
  lastPlayTime: number;
  chestGranted: boolean;
}
