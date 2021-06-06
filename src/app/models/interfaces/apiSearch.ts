import {CardAPI} from "../cardAPI";

export interface ApiSearch {
  data: CardAPI[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
}
