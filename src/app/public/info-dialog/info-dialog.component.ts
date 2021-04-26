import { Component, OnInit } from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {CardAPI} from "../../models/cardAPI";

export interface CardContent {
  number?: string;
  name?: string;
  collectionName?: string;
  collectionId?: string;
  type?: string;
  rarity?: string;
  price?: string;
  image?: string;
  quantity?: string;
}

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss']
})
export class InfoDialogComponent implements OnInit {

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  headers = [
    {label: 'Card #', field: 'number'},
    {label: 'Card Name', field: 'name'},
    {label: 'Type', field: 'type'},
    {label: 'Rarity', field: 'rarity'},
    {label: 'Price (Un)', field: 'price'},
    {label: 'Quantity', field: 'quantity'},
    {label:'Image', field: 'image'}
  ];

  content: CardContent[];
  loading = true;

  ngOnInit(): void {
    const cards: CardAPI[] = this.config.data;
    this.content = [];
    cards.forEach( card => {
      let content: CardContent = {};
      let types: string = '';
      if (card.subtypes) {
        card.subtypes.forEach(value => {
          types += value + ', ';
        });
        types = types.slice(0, -2);
      }

      content.number = card.number;
      content.name = card.name;
      content.type = types;
      content.rarity = card.rarity;
      content.collectionName = card.set.name;
      content.collectionId = card.set.id;
      content.quantity = card.cardCSV.quantity.toString();
      content.price = this.getPrice(card);
      content.image = card.images.large;

      this.content.push(content);
    });
    this.loading = false;
  }

  getPrice (card: CardAPI) {
    if (card.tcgplayer) {
      return '0.00';
    } else if (card.cardCSV.extras && card.cardCSV.extras.length > 0 && card.cardCSV.extras.includes("Foil") && card.tcgplayer.prices['holofoil']) {
      return Number(card.tcgplayer.prices['holofoil'].market).toFixed(2);
    } else if (card.cardCSV.extras && card.cardCSV.extras.length > 0 && card.cardCSV.extras.includes("Reverse Foil") && card.tcgplayer.prices['reverseHolofoil']) {
      return Number(card.tcgplayer.prices['reverseHolofoil'].market).toFixed(2);
    } else if (card.tcgplayer.prices['normal']) {
      return Number(card.tcgplayer.prices['normal'].market).toFixed(2);
    } else {
      for (let pricesKey in card.tcgplayer.prices) {
        return Number(card.tcgplayer.prices[pricesKey].market).toFixed(2);
      }
    }
  }

  goToLink(url: string){
    window.open(url, "_blank");
  }

  getBadge (rarity:string) {
    rarity = rarity.replace(/ /g, '').replace(/\./g, '').toLocaleLowerCase();
    return rarity;
  }

}
