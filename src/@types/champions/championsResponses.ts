export interface AllChampionsRes<T> {
  data: T[];
}

export interface ChampionData {
  version: string;
  id: string;
  key: string;
  name: string;
  title: string;
  blurb: string;
  info: Info;
  image: Image;
  tags: string[];
  partype: string;
  stats: Stats;
}

export interface ChampionBase {
  championName: string;
  championId: string;
  championKey: number;
}

interface Info {
  attack: number;
  defense: number;
  magic: number;
  difficulty: number;
}

interface Image {
  full: string;
  sprite: string;
  group: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Stats {
  hp: number;
  hpperlevel: number;
  mp: number;
  mpperlevel: number;
  movespeed: number;
  armor: number;
  armorperlevel: number;
  spellblock: number;
  spellblockperlevel: number;
  attackrange: number;
  hpregen: number;
  hpregenperlevel: number;
  mpregen: number;
  mpregenperlevel: number;
  crit: number;
  critperlevel: number;
  attackdamage: number;
  attackdamageperlevel: number;
  attackspeedperlevel: number;
  attackspeed: number;
}
export interface ChampionDetailsRequestProps {
  [championName: string]: ChampionDetails;
}
export interface ChampionDetails {
  id: string;
  key: string;
  name: string;
  title: string;
  image: Image;
  skins: Skin[];
  lore: string;
  blurb: string;
  allytips: string[];
  enemytips: string[];
  tags: string[];
  partype: string;
  info: Info;
  stats: Stats;
  spells: Spell[];
  passive: Passive;
  recommended: any[];
}

export interface Skin {
  id: string;
  num: number;
  name: string;
  chromas: boolean;
}

export interface Spell {
  id: string;
  name: string;
  description: string;
  tooltip: string;
  leveltip: Leveltip;
  maxrank: number;
  cooldown: number[];
  cooldownBurn: string;
  cost: number[];
  costBurn: string;
  effect: number[] | undefined[];
  effectBurn: string | undefined[];
  vars: any[];
  costType: string;
  maxammo: string;
  range: number[];
  rangeBurn: string;
  image: Image;
  resource: string;
}

export interface Leveltip {
  label: string[];
  effect: string[];
}

export interface Passive {
  name: string;
  description: string;
  image: Image;
  tooltip?: string;
  maxrank?: number;
  cooldown?: number[];
  cooldownBurn?: string;
  cost?: number[];
  costBurn?: string;
  datavalues?: any;
  effect?: Array<number[]>;
  effectBurn?: string[];
  vars?: any[];
  costType?: string;
  maxammo?: string;
  range?: number[];
  rangeBurn?: string;
  resource?: string;
}
