import {set} from "./set";
import {prices} from "./prices";

export class card {
  id: String;
  name: String;
  supertype: String;
  subtypes: any;
  types: any;
  set: set;
  number: String;
  artist: String;
  rarity: String;
  prices: prices;
  quantity: number;
}
