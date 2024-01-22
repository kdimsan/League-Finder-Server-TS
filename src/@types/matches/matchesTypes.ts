export interface MatchResponse {
  metadata: Metadata;
  info: Info;
}

interface Metadata {
  participants: string[];
}

interface Info {
  gameMode: string;
  gameName: string;
}
