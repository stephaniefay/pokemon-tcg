import {CardAPI} from "../cardAPI";

export interface VerifyCollectionInterface {
  card: CardAPI;
  owned: boolean;
  wish: boolean;
}
