import {SetCard} from "./setCard";
import {PricesCard} from "./pricesCard";

export class CardAPI {
  id: String;
  name: String;
  supertype: String;
  subtypes: any;
  types: any;
  set: SetCard;
  number: String;
  artist: String;
  rarity: String;
  prices: PricesCard;
  quantity: number;
}
