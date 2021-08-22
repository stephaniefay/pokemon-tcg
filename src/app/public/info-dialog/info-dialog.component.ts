import { Component, OnInit } from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {CardAPI} from "../../models/cardAPI";
import {CardContent} from "../../models/interfaces/cardContent";

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
    {label: 'Quality', field: 'quality'}
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
      content.isFoil = (card.cardCSV.extras != null && card.cardCSV.extras.includes("Foil"));
      content.isReverse = (card.cardCSV.extras != null && card.cardCSV.extras.includes("Reverse Foil"));
      content.language = card.cardCSV.language;
      content.quality = card.cardCSV.quality;
      this.content.push(content);
    });
    this.content.sort((a,b) => a.name.localeCompare(b.name));
    this.loading = false;
  }

  getPrice (card: CardAPI) {
    let flag = false;
    if (card.tcgplayer == null) {
      return '0.00';
    } else if (card.cardCSV.extras && card.cardCSV.extras.length > 0 && card.cardCSV.extras.includes("Edition One")) {
      if (card.cardCSV.extras.includes("Foil")) {
        if (card.tcgplayer.prices['holo1stEditionHolofoilfoil']) {
          return Number(card.tcgplayer.prices['holo1stEditionHolofoilfoil'].market).toFixed(2);
        } else if (card.tcgplayer.prices['1stEditionNormal']) {
          return Number(card.tcgplayer.prices['1stEditionNormal'].market).toFixed(2);
        } else {
          flag = true;
        }
      } else {
        if (card.tcgplayer.prices['1stEditionNormal']) {
          return Number(card.tcgplayer.prices['1stEditionNormal'].market).toFixed(2);
        } else {
          flag = true;
        }
      }
    } else if (card.cardCSV.extras && card.cardCSV.extras.length > 0 && card.cardCSV.extras.includes("Foil") && card.tcgplayer.prices['holofoil']) {
      return Number(card.tcgplayer.prices['holofoil'].market).toFixed(2);
    } else if (card.cardCSV.extras && card.cardCSV.extras.length > 0 && card.cardCSV.extras.includes("Reverse Foil") && card.tcgplayer.prices['reverseHolofoil']) {
      return Number(card.tcgplayer.prices['reverseHolofoil'].market).toFixed(2);
    } else if (card.tcgplayer.prices['normal']) {
      return Number(card.tcgplayer.prices['normal'].market).toFixed(2);
    } else {
      flag = true;
    }

    if (flag) {
      for (let pricesKey in card.tcgplayer.prices) {
        return Number(card.tcgplayer.prices[pricesKey].market).toFixed(2);
      }
    }
  }

  getBadge (rarity:string) {
    if (rarity == null) rarity = 'Common';
    rarity = rarity.replace(/ /g, '').replace(/\./g, '').toLocaleLowerCase();
    return rarity;
  }

  getQuality (quality: string) {
    switch (quality) {
      case 'M':
        return 'Mint';
      case 'NM':
        return 'Near Mint';
      case 'SP':
        return 'Slightly Played';
      case 'MP':
        return 'Moderately Played';
      case 'HP':
        return 'Heavily Played';
      case 'D':
        return 'Damaged';
    }
  }
}
