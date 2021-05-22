import {CardAPI} from "./cardAPI";

export interface DeckCard {
  quantity: number;
  card: CardAPI;
}

export class Deck {
  name: string;
  type: string;
  legality: string;
  cards: DeckCard[];
}
