import { Component, OnInit } from '@angular/core';
import {CardAPI} from "../../models/cardAPI";
import {SelectItem} from "primeng/api";
import {ApiCardService} from "../../services/api-card.service";

export interface CardAPIFirebase {
  key: string;
  cardApi: CardAPI;
}

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})

export class CollectionComponent implements OnInit {

  cards: CardAPIFirebase[];
  sortOptions: SelectItem[];
  sortOrder: number;
  sortField: string;
  loading = true;

  constructor(private service: ApiCardService) {
  }

  ngOnInit(): void {
    this.service.getAll().subscribe( data => {
      this.cards = [];
      data.forEach( item => {
        this.initializePrice(item.cardApi);
        this.cards.push({key: item.key, cardApi: item.cardApi});
      });
      this.loading = false;
    });

    this.sortOptions = [
      {label: 'Price High to Low', value: '!cardApi.priceTotal'},
      {label: 'Price Low to High', value: 'cardApi.priceTotal'},
      {label: 'Alphabetically', value: 'cardApi.name'}
    ];
  }

  onSortChange(event) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    }
    else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  getBadge (rarity:string) {
    rarity = rarity.replace(/ /g, '').replace(/\./g, '').toLocaleLowerCase();
    return rarity;
  }

  getPrice (card: CardAPI) {
    if (card.priceTotal == null) {
      this.initializePrice(card);
    }
    return card.priceTotal;
  }

  initializePrice (card: CardAPI) {
      let value: number;
      if (card.cardCSV.extras && card.cardCSV.extras.length > 0 && card.cardCSV.extras.includes("Foil")) {
        value = Number(card.tcgplayer.prices['holofoil'].market);
      } else if (card.cardCSV.extras && card.cardCSV.extras.length > 0 && card.cardCSV.extras.includes("Reverse Foil")) {
        if (card.tcgplayer.prices['reverseHolofoil']) {
          value = Number(card.tcgplayer.prices['reverseHolofoil'].market);
        } else {
          for (let pricesKey in card.tcgplayer.prices) {
            value = Number(card.tcgplayer.prices[pricesKey].market);
            break;
          }
        }
      } else if (card.tcgplayer.prices['normal']) {
        value = Number(card.tcgplayer.prices['normal'].market);
      } else {
        value = 0;
      }

      value = value * card.cardCSV.quantity;
      card.priceTotal = Number(value.toFixed(2));
  }

  getDescriptor (card: CardAPI) {
    let descriptor: string = this.getPrice(card) + ' = (';
    if (card.cardCSV.extras && card.cardCSV.extras.length > 0 && card.cardCSV.extras.includes("Foil")) {
        descriptor += card.tcgplayer.prices['holofoil'].market + ' x ';
    } else if (card.cardCSV.extras && card.cardCSV.extras.length > 0 && card.cardCSV.extras.includes("Reverse Foil")) {
      if (card.tcgplayer.prices['reverseHolofoil']) {
        descriptor += card.tcgplayer.prices['reverseHolofoil'].market + ' x ';
      }  else {
        for (let pricesKey in card.tcgplayer.prices) {
          descriptor += card.tcgplayer.prices[pricesKey].market + ' x ';
          break;
        }
      }
    } else if (card.tcgplayer.prices['normal']) {
      descriptor += card.tcgplayer.prices['normal'].market + ' x ';
    } else {
      descriptor += '0 x ';
    }

    descriptor += card.cardCSV.quantity + ')';
    return descriptor;
  }

}
