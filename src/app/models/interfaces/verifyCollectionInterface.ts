import {CardAPI} from "../cardAPI";

export interface VerifyCollectionInterface {
  card: CardAPI;
  id: string;
  owned: boolean;
  wish: boolean;
}
