export interface RankedResponses {
  tier: string;
  leagueId: string;
  queue: string;
  name: string;
  entries: Entry[];
}

export interface Entry {
  summonerId: string;
  leaguePoints: number;
  rank: string;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
}
