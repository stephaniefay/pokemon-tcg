export interface Edition {
  name?: string;
  image?: string;
}

export class CSVCard {
  key: string;
  id: string;
  edition: Edition;
  edition_ptbr: string;
  initials: string;
  cardName: string;
  cardName_ptbr: string;
  cardNumber: string;
  quantity: number;
  quality: string;
  language: string;
  rarity: string;
  color: string;
  extras: any[];
  comments: string;
  cardsInEdition: string;
  dateImport: number;
}
