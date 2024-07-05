import { ChampionBase } from "../champions/championsResponses";

export interface MatchResponse {
  metadata: Metadata;
  info: Info;
}

export interface MatchesDetailsReturn {
  matchInfo: InfoReturn;
  participantsPuuid: string[];
}

interface Metadata {
  participants: string[];
}

export interface InfoReturn {
  gameMode: string;
  gameEndTimestamp: number;
  gameStartTimestamp: number;
  gameDuration: number;
  gameType: string;
  participantsData: ParticipantsReturn[];
  queueType: QueueFormatedProps;
  teams: TeamsResponse[];
  searchSummonerData: SummonerMatchDataProps | null;
}

export interface QueueFormatedProps {
  queueDescription: string | null;
  map: string;
  notes: string | null;
}

export interface Info {
  gameMode: string;
  gameEndTimestamp: number;
  gameStartTimestamp: number;
  gameDuration: number;
  gameId: number;
  gameType: string;
  participants: Participant[];
  queueId: number;
  teams: Team[];
}

export interface Participant {
  assists: number;
  challenges: Challenges;
  champLevel: number;
  championId: number;
  championName: string;
  deaths: number;
  goldEarned: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  kills: number;
  lane: string;
  neutralMinionsKilled: number;
  perks: Perks;
  profileIcon: number;
  puuid: string;
  riotIdGameName: string;
  riotIdTagline: string;
  role: string;
  summonerId: string;
  summoner1Id: string;
  summoner2Id: string;
  summonerLevel: number;
  teamId: number;
  totalDamageDealtToChampions: number;
  totalDamageTaken: number;
  totalMinionsKilled: number;
  visionScore: number;
  wardsKilled: number;
  wardsPlaced: number;
  win: boolean;
}

export interface ParticipantsFullReturnProps {
  summonerMatchData: SummonerMatchDataProps | null;
  returnParticipantsArray: ParticipantsReturn[];
}

export interface ParticipantsReturn {
  assists: number;
  challenges: Challenges;
  champLevel: number;
  championId: number;
  championName: string;
  deaths: number;
  goldEarned: number;
  kills: number;
  lane: string;
  neutralMinionsKilled: number;
  perks: Runes;
  profileIcon: number;
  puuid: string;
  riotIdGameName: string;
  riotIdTagline: string;
  role: string;
  summonerId: string;
  summonerSpell1: string;
  summonerSpell2: string;
  summonerLevel: number;
  teamId: number;
  totalDamageDealtToChampions: number;
  totalDamageTaken: number;
  totalMinionsKilled: number;
  totalFarm: number;
  items: number[];
  visionScore: number;
  wardsKilled: number;
  wardsPlaced: number;
  win: boolean;
}

export interface SummonerMatchDataProps {
  puiid: string;
  championName: string;
  win: boolean;
  lane: string;
  role: string;
}

interface Runes {
  mainRune: number;
  secondaryRuneStyle: number;
}

export interface Challenges {
  goldPerMinute: number;
  kda: number;
  killParticipation: number;
  gameLength: number;
}

interface Perks {
  statPerks: StatPerks;
  styles: Style[];
}

interface StatPerks {
  defense: number;
  flex: number;
  offense: number;
}

export interface Style {
  description: string;
  selections: Selection[];
  style: number;
}

interface Selection {
  perk: number;
  var1: number;
  var2: number;
  var3: number;
}

export interface Team {
  bans: Bans[];
  objectives: Objectives;
  teamId: number;
  win: boolean;
}

export interface TeamsResponse {
  bans: ChampionBase[];
  objectives: ObjectivesReturn;
  teamId: number;
  win: boolean;
}

export interface Bans {
  championId: number;
  pickTurn: number;
}

interface ObjectivesReturn {
  baron: number;
  champion: number;
  dragon: number;
  horde: number;
  inhibitor: number;
  riftHerald: number;
  tower: number;
  totalGold: number;
  damageDealt: number;
  damageTaken: number;
  totalFarm: number;
  totalWards: number;
}

interface Objectives {
  baron: Baron;
  champion: Champion;
  dragon: Dragon;
  horde: Horde;
  inhibitor: Inhibitor;
  riftHerald: RiftHerald;
  tower: Tower;
}

interface Baron {
  first: boolean;
  kills: number;
}

interface Champion {
  first: boolean;
  kills: number;
}

interface Dragon {
  first: boolean;
  kills: number;
}

interface Horde {
  first: boolean;
  kills: number;
}

interface Inhibitor {
  first: boolean;
  kills: number;
}

interface RiftHerald {
  first: boolean;
  kills: number;
}

interface Tower {
  first: boolean;
  kills: number;
}
