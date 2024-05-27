export interface SummonerResByGameName {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface SummonerByPuuid {
  id: string;
  accountId: string;
  puuid: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

export interface SummonerResponseData {
  gameName: string;
  tagLine: string;
  id: string;
  accountId: string;
  puuid: string;
  profileIconId: number;
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
  championKey: number;
  championName: string;
  championId: string;
  championLevel: number;
  championPoints: number;
  lastPlayTime: number;
  chestGranted: boolean;
}
