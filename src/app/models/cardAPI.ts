import {CSVCard} from "./CSVCard";

export interface Attack {
  name: string;
  cost: any[];
  convertedEnergyCost: number;
  damage: string;
  text: string;
}

export interface Weakness {
  type: string;
  value: string;
}

export interface Set {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  legalities: Legalities
  ptcgoCode: string
  releaseDate: string;
  updatedAt: string;
  images: ImagesSet;
}

export interface ImagesSet {
  symbol: string;
  logo: string;
}

export interface Legalities {
  unlimited: string;
  standard: string;
  expanded: string;
}

export interface ImagesCard {
  small: string;
  large: string;
}

export interface TcgPlayer {
  url: string;
  updatedAt: string;
  prices: Price
}

export interface Price {
  holofoil?: PriceIn;
  normal?: PriceIn;
}

export interface PriceIn {
  low: string;
  mid: string;
  high: string;
  market: string;
  directLow: string;
}

export class CardAPI {
  id: string;
  name: string;
  supertype: string;
  subtypes: any[];
  hp: string;
  types: any[];
  evolvesFrom: string;
  evolvesTo: any[];
  attacks: Attack[];
  weaknesses: Weakness[];
  retreatCost: any[];
  convertedRetreatCost: number;
  set: Set;
  number: string;
  artist: string;
  rarity: string;
  flavorText: string;
  nationalPokedexNumbers: any[];
  legalities: Legalities;
  images: ImagesCard;
  tcgplayer: TcgPlayer;
  cardCSV: CSVCard;
  priceTotal: number;
  dexNum: number;
  extras: string;
  language: string;
}
