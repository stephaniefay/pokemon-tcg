import { Component, OnInit } from '@angular/core';
import {CardAPI} from "../../models/cardAPI";
import {SelectItem} from "primeng/api";
import {ApiCardService} from "../../services/api-card.service";
import {ConfigurationService} from "../../services/configuration.service";
import {configurations} from "../../models/interfaces/configurations";

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
  behaviour: string;
  cardByPage: number;
  sortOrder: number;
  sortField: string;
  loading = true;

  constructor(private service: ApiCardService,
              private configService: ConfigurationService) {
  }

  ngOnInit(): void {
    this.service.getAll().subscribe( data => {
      this.cards = [];
      data.forEach( item => {
        item.cardApi.priceTotal = this.initializePrice(item.cardApi);
        this.getDexNum(item.cardApi);
        this.cards.push({key: item.key, cardApi: item.cardApi});
      });

      this.configService.loadFilter().subscribe((filter:configurations) => {
        if (filter != null)
          this.onSortChange({originalEvent: null, value: filter.value});
      });

      this.configService.loadBehaviour().subscribe((behaviour:configurations) => {
        this.behaviour = behaviour.value;
      })

      this.loading = false;
    });

    this.sortOptions = [
      {label: 'Dex Number', value: 'cardApi.dexNum'},
      {label: 'Acquisition Date (Desc)', value: '!cardApi.cardCSV.dateImport'},
      {label: 'Acquisition Date (Asc)', value: 'cardApi.cardCSV.dateImport'},
      {label: 'Alphabetically', value: 'cardApi.name'},
      {label: 'Price High to Low', value: '!cardApi.priceTotal'},
      {label: 'Price Low to High', value: 'cardApi.priceTotal'}
    ];

    this.cardByPage = 9;
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
    if (rarity == null) rarity = 'Common';
    rarity = rarity.replace(/ /g, '').replace(/\./g, '').toLocaleLowerCase();
    return rarity;
  }

  getPriceItem (card: CardAPI) {
    if (card.priceTotal == null) {
      this.initializePriceItem(card);
    }
    return card.priceTotal;
  }

  getPriceTotal (card: CardAPI) {
    this.initializePriceTotal(card);
    return card.priceTotal;
  }

  initializePrice (card: CardAPI) {
    let flag = false;
    let value: number;
    if (card.tcgplayer == null || card.tcgplayer.prices == null) {
      value = 0;
    } else if (card.cardCSV.extras && card.cardCSV.extras.length > 0 && card.cardCSV.extras.includes("Edition One")) {
      if (card.cardCSV.extras.includes("Foil")) {
        if (card.tcgplayer.prices['holo1stEditionHolofoilfoil']) {
          value = Number(card.tcgplayer.prices['holo1stEditionHolofoilfoil'].market);
        } else if (card.tcgplayer.prices['1stEditionNormal']) {
          value = Number(card.tcgplayer.prices['1stEditionNormal'].market);
        } else {
          flag = true;
        }
      } else {
        if (card.tcgplayer.prices['1stEditionNormal']) {
          value = Number(card.tcgplayer.prices['1stEditionNormal'].market);
        } else {
          flag = true;
        }
      }
    } else if (card.cardCSV.extras && card.cardCSV.extras.length > 0 && card.cardCSV.extras.includes("Foil") && card.tcgplayer.prices['holofoil']) {
      value = Number(card.tcgplayer.prices['holofoil'].market);
    } else if (card.cardCSV.extras && card.cardCSV.extras.length > 0 && card.cardCSV.extras.includes("Reverse Foil") && card.tcgplayer.prices['reverseHolofoil']) {
      value = Number(card.tcgplayer.prices['reverseHolofoil'].market);
    } else if (card.tcgplayer.prices['normal']) {
      value = Number(card.tcgplayer.prices['normal'].market);
    } else {
      flag = true;
    }

    if (isNaN(value)) value = 0;

    if (flag) {
      for (let pricesKey in card.tcgplayer.prices) {
        value = Number(card.tcgplayer.prices[pricesKey].market);
        break;
      }
    }

    return value;
  }

  initializePriceTotal (card: CardAPI) {
    const value = this.initializePrice(card) * card.cardCSV.quantity;
    card.priceTotal = Number(value.toFixed(2));
  }

  initializePriceItem (card: CardAPI) {
    card.priceTotal = Number(this.initializePrice(card).toFixed(2));
  }

  getDescriptorTotal (card: CardAPI) {
    let flag = false;
    let descriptor: string = this.getPriceTotal(card) + ' = (';
    if (card.tcgplayer == null || card.tcgplayer.prices == null) {
      descriptor += '0 x ';
    } else if (card.cardCSV.extras && card.cardCSV.extras.length > 0 && card.cardCSV.extras.includes("Edition One")) {
      if (card.cardCSV.extras.includes("Foil")) {
        if (card.tcgplayer.prices['holo1stEditionHolofoilfoil']) {
          descriptor += card.tcgplayer.prices['holo1stEditionHolofoilfoil'].market + ' x ';
        } else if (card.tcgplayer.prices['1stEditionNormal']) {
          descriptor += card.tcgplayer.prices['1stEditionNormal'].market + ' x ';
        } else {
          flag = true;
        }
      } else {
        if (card.tcgplayer.prices['1stEditionNormal']) {
          descriptor += card.tcgplayer.prices['1stEditionNormal'].market + ' x ';
        } else {
          flag = true;
        }
      }
    } else if (card.cardCSV.extras && card.cardCSV.extras.length > 0 && card.cardCSV.extras.includes("Foil") && card.tcgplayer.prices['holofoil']) {
      descriptor += card.tcgplayer.prices['holofoil'].market + ' x ';
    } else if (card.cardCSV.extras && card.cardCSV.extras.length > 0 && card.cardCSV.extras.includes("Reverse Foil") && card.tcgplayer.prices['reverseHolofoil']) {
      descriptor += card.tcgplayer.prices['reverseHolofoil'].market + ' x ';
    } else if (card.tcgplayer.prices['normal']) {
      descriptor += card.tcgplayer.prices['normal'].market + ' x ';
    } else {
      flag = true;
    }

    if (flag) {
      for (let pricesKey in card.tcgplayer.prices) {
        descriptor += card.tcgplayer.prices[pricesKey].market + ' x ';
        break;
      }
    }

    descriptor += card.cardCSV.quantity + ')';
    return descriptor;
  }

  getExtra (card: CardAPI) {
    if (card.cardCSV.extras == null)
      return null;

    if (card.cardCSV.extras.includes('Foil')) {
      if (card.cardCSV.extras.includes('Oversize')) {
        return 'Oversized';
      }
      return 'Foil';
    } else if (card.cardCSV.extras.includes('Reverse Foil')) {
      return 'Reverse';
    } else if (card.cardCSV.extras.includes('Edition One')) {
      return 'Edition #1';
    } else if (card.cardCSV.extras.includes('Oversize')) {
      return 'Oversized';
    }

    return null;
  }

  getExtraClass (card: CardAPI) {
    if (card.cardCSV.extras == null)
      return null;

    if (card.cardCSV.extras.includes('Foil')) {
      if (card.cardCSV.extras.includes('Oversize')) {
        return 'oversize';
      }

      return 'holo';
    } else if (card.cardCSV.extras.includes('Reverse Foil')) {
      return 'reverseholo';
    } else if (card.cardCSV.extras.includes('Edition One')) {
      return 'editionone';
    } else if (card.cardCSV.extras.includes('Oversize')) {
      return 'oversize';
    }

    return null;
  }

  getDexNum (card: CardAPI) {
    if (card.nationalPokedexNumbers == null || card.nationalPokedexNumbers.length == 0)
      card.dexNum = 999;
    else
      card.dexNum = card.nationalPokedexNumbers[0];
  }

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

}
