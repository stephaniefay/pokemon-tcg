export class PricesCard {
  url: String;
  updatedAt: Date;
  normal: {low: number, mid: number, high: number, market: number, directLow: number};
  holofoil: {low: number, mid: number, high: number, market: number, directLow: number};
  reverseHolofoil: {low: number, mid: number, high: number, market: number, directLow: number};
}
