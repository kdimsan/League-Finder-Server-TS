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
  gameStartTimestamp: number;
  gameDuration: number;
  gameType: string;
  participantsData: NewParticipants[];
  teams: Team[];
}

interface Info {
  gameMode: string;
  gameStartTimestamp: number;
  gameDuration: number;
  gameId: number;
  gameType: string;
  participants: Participant[];
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

export interface NewParticipants {
  assists: number;
  champLevel: number;
  championId: number;
  championName: string;
  deaths: number;
  goldEarned: number;
  kills: number;
  lane: string;
  neutralMinionsKilled: number;
  perks: string[];
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
  items: number[];
  visionScore: number;
  wardsKilled: number;
  wardsPlaced: number;
  win: boolean;
}

interface Challenges {
  goldPerMinute: number;
  kda: number;
  killParticipation: number;
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

interface Team {
  bans: any[];
  objectives: Objectives;
  teamId: number;
  win: boolean;
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
