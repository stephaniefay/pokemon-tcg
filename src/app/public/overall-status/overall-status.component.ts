import { Component, OnInit } from '@angular/core';
import {ApiCardService} from "../../services/api-card.service";
import {CardAPI} from "../../models/cardAPI";
import {DialogService} from "primeng/dynamicdialog";
import {InfoDialogComponent} from "../info-dialog/info-dialog.component";
import {CollectionsFunctions} from "../../models/collections";

@Component({
  selector: 'app-overall-status',
  templateUrl: './overall-status.component.html',
  styleUrls: ['./overall-status.component.scss']
})
export class OverallStatusComponent implements OnInit {

  constructor(private service: ApiCardService,
              public dialogService: DialogService) { }

  loading = true;

  // quantity of cards (general)
  qtdTotalCards = 0;
  qtdTotalUniqueCards = 0;
  qtdTotalTrainerCards = 0;
  qtdTotalPokemonCards = 0;
  qtdTotalEnergyCards = 0;

  energyMap = new Map();
  trainerMap = new Map();
  pokemonMap = new Map();
  stagesMap = new Map();
  collectionMap = new Map();
  qualityMap = new Map();
  rarityMap = new Map();
  illustratorMap = new Map();

  energyArray = [];
  energyIndexArray = [];
  trainerArray = [];
  trainerIndexArray = [];
  pokemonArray = [];
  pokemonIndexArray = [];
  stagesArray = [];
  stagesIndexArray = [];
  collectionArray = [];
  collectionIndexArray = [];
  qualityArray = [];
  qualityIndexArray = [];
  rarityArray = [];
  rarityIndexArray = [];
  illustratorArray = [];
  illustratorIndexArray = [];

  // prices + fake
  noPrice = [];
  totalPriceLow = 0;
  totalPriceMedium = 0;
  totalPriceHigh = 0;
  totalPriceMarket = 0;

  ngOnInit(): void {
    this.service.getAll().subscribe(content => {
      this.qtdTotalUniqueCards = content.length;
      content.forEach(card => {
        this.qtdTotalCards += card.cardApi.cardCSV.quantity;
        if (card.cardApi.supertype == 'Energy') {
          this.qtdTotalEnergyCards += card.cardApi.cardCSV.quantity;
          this.setTypeEnergy(card.cardApi);
        } else if (card.cardApi.supertype == 'Trainer') {
          this.qtdTotalTrainerCards += card.cardApi.cardCSV.quantity;
          this.setTypeTrainer(card.cardApi);
        } else if (card.cardApi.supertype == 'Pokémon') {
          this.qtdTotalPokemonCards += card.cardApi.cardCSV.quantity;
          this.setPokemonStages(card.cardApi);
          this.setPokemonTypes(card.cardApi);
        }
        this.setPrices(card.cardApi);
        this.setCollection(card.cardApi);
        this.setQuality(card.cardApi);
        this.setRarity(card.cardApi);
        this.setIllustrator(card.cardApi);
      });
      this.configureArrays(this.pokemonMap, this.pokemonArray, this.pokemonIndexArray);
      this.configureArrays(this.stagesMap, this.stagesArray, this.stagesIndexArray);
      this.configureArrays(this.energyMap, this.energyArray, this.energyIndexArray);
      this.configureArrays(this.trainerMap, this.trainerArray, this.trainerIndexArray);
      this.configureArrays(this.qualityMap, this.qualityArray, this.qualityIndexArray);
      this.configureArrays(this.rarityMap, this.rarityArray, this.rarityIndexArray);
      this.configureArrays(this.collectionMap, this.collectionArray, this.collectionIndexArray);
      this.configureArrays(this.illustratorMap, this.illustratorArray, this.illustratorIndexArray);
      this.collectionIndexArray.sort((a,b) => this.getCollectionName(a).localeCompare(this.getCollectionName(b)));
      this.loading = false;
    });
  }

  setTypeEnergy (card: CardAPI) {
    card.subtypes.forEach(type => {
      const energyTypeArray: CardAPI[] = this.energyMap.get(type);
      if (energyTypeArray) {
        energyTypeArray.push(card);
        this.energyMap.set(type, energyTypeArray);
      } else {
        const newEnergyTypeArray = [];
        newEnergyTypeArray.push(card);
        this.energyMap.set(type, newEnergyTypeArray);
      }
    });
  }

  setTypeTrainer (card: CardAPI) {
    if (card.subtypes) {
      card.subtypes.forEach(type => {
        const trainerTypeArray: CardAPI[] = this.trainerMap.get(type);
        if (trainerTypeArray) {
          trainerTypeArray.push(card);
          this.trainerMap.set(type, trainerTypeArray);
        } else {
          const newTrainerTypeArray = [];
          newTrainerTypeArray.push(card);
          this.trainerMap.set(type, newTrainerTypeArray);
        }
      });
    } else {
      const noTypeArray: CardAPI[] = this.trainerMap.get('No Type');
      if (noTypeArray) {
        noTypeArray.push(card);
        this.trainerMap.set('No Type', noTypeArray);
      } else {
        const newNoTypeArray = [];
        newNoTypeArray.push(card);
        this.trainerMap.set('No Type', newNoTypeArray);
      }
    }
  }

  setPokemonTypes (card: CardAPI) {
    card.types.forEach(type => {
      const pokemonTypeArray: CardAPI[] = this.pokemonMap.get(type);
      if (pokemonTypeArray) {
        pokemonTypeArray.push(card);
        this.pokemonMap.set(type, pokemonTypeArray);
      } else {
        const newPokemonTypeArray = [];
        newPokemonTypeArray.push(card);
        this.pokemonMap.set(type, newPokemonTypeArray);
      }
    });
  }

  setPrices (card: CardAPI) {
    let high: number;
    let medium: number;
    let low: number;
    let market: number;
    let flag = false;
    if (card.tcgplayer == null || card.tcgplayer.prices == null) {
      high = 0;
      medium = 0;
      low = 0;
      market = 0;
      this.noPrice.push(card);
    } else if (card.cardCSV.extras && card.cardCSV.extras.length > 0 && card.cardCSV.extras.includes("Edition One")) {
      if (card.cardCSV.extras.includes("Foil")) {
        if (card.tcgplayer.prices['holo1stEditionHolofoilfoil']) {
          high = Number(card.tcgplayer.prices['holo1stEditionHolofoilfoil'].high);
          medium = Number(card.tcgplayer.prices['holo1stEditionHolofoilfoil'].mid);
          low = Number(card.tcgplayer.prices['holo1stEditionHolofoilfoil'].low);
          market = Number(card.tcgplayer.prices['holo1stEditionHolofoilfoil'].market);
        } else if (card.tcgplayer.prices['1stEditionNormal']) {
          high = Number(card.tcgplayer.prices['1stEditionNormal'].high);
          medium = Number(card.tcgplayer.prices['1stEditionNormal'].mid);
          low = Number(card.tcgplayer.prices['1stEditionNormal'].low);
          market = Number(card.tcgplayer.prices['1stEditionNormal'].market);
        } else {
          flag = true;
        }
      } else {
        if (card.tcgplayer.prices['1stEditionNormal']) {
          high = Number(card.tcgplayer.prices['1stEditionNormal'].high);
          medium = Number(card.tcgplayer.prices['1stEditionNormal'].mid);
          low = Number(card.tcgplayer.prices['1stEditionNormal'].low);
          market = Number(card.tcgplayer.prices['1stEditionNormal'].market);
        } else {
          flag = true;
        }
      }
    } else if (card.cardCSV.extras && card.cardCSV.extras.length > 0 && card.cardCSV.extras.includes("Foil") && card.tcgplayer.prices['holofoil']) {
      high = Number(card.tcgplayer.prices['holofoil'].high);
      medium = Number(card.tcgplayer.prices['holofoil'].mid);
      low = Number(card.tcgplayer.prices['holofoil'].low);
      market = Number(card.tcgplayer.prices['holofoil'].market);
    } else if (card.cardCSV.extras && card.cardCSV.extras.length > 0 && card.cardCSV.extras.includes("Reverse Foil") && card.tcgplayer.prices['reverseHolofoil']) {
      high = Number(card.tcgplayer.prices['reverseHolofoil'].high);
      medium = Number(card.tcgplayer.prices['reverseHolofoil'].mid);
      low = Number(card.tcgplayer.prices['reverseHolofoil'].low);
      market = Number(card.tcgplayer.prices['reverseHolofoil'].market);
    } else if (card.tcgplayer && card.tcgplayer.prices['normal']) {
        high = Number(card.tcgplayer.prices['normal'].high);
        medium = Number(card.tcgplayer.prices['normal'].mid);
        low = Number(card.tcgplayer.prices['normal'].low);
        market = Number(card.tcgplayer.prices['normal'].market);
    } else {
      flag = true;
    }

    if (flag) {
      for (let pricesKey in card.tcgplayer.prices) {
        high = Number(card.tcgplayer.prices[pricesKey].high);
        medium = Number(card.tcgplayer.prices[pricesKey].mid);
        low = Number(card.tcgplayer.prices[pricesKey].low);
        market = Number(card.tcgplayer.prices[pricesKey].market);
        break;
      }
    }

    if (isNaN(market)) market = 0;
    if (isNaN(high)) high = 0;
    if (isNaN(medium)) medium = 0;
    if (isNaN(low)) low = 0;

    if (isNaN(market) && isNaN(high) && isNaN(medium) && isNaN(low)) this.noPrice.push(card);

    high = high * card.cardCSV.quantity;
    medium = medium * card.cardCSV.quantity;
    low = low * card.cardCSV.quantity;
    market = market * card.cardCSV.quantity;

    this.totalPriceHigh += high;
    this.totalPriceMedium += medium;
    this.totalPriceLow += low;
    this.totalPriceMarket += market;
  }

  setPokemonStages (card: CardAPI) {
    card.subtypes.forEach(type => {
      const pokemonStageArray: CardAPI[] = this.stagesMap.get(type);
      if (pokemonStageArray) {
        pokemonStageArray.push(card);
        this.stagesMap.set(type, pokemonStageArray);
      } else {
        const newPokemonStageArray = [];
        newPokemonStageArray.push(card);
        this.stagesMap.set(type, newPokemonStageArray);
      }
    });
  }

  setCollection (card: CardAPI) {
    const collectionArray: CardAPI[] = this.collectionMap.get(card.set.id);
    if (collectionArray) {
      collectionArray.push(card);
      this.collectionMap.set(card.set.id, collectionArray);
    } else {
      const newCollectionArray: CardAPI[] = [];
      newCollectionArray.push(card);
      this.collectionMap.set(card.set.id, newCollectionArray);
    }
  }

  setIllustrator (card: CardAPI) {
    if (card.artist == undefined || card.artist.trim() == '') {
      card.artist = 'No name';
    }
    const illustratorArray: CardAPI[] = this.illustratorMap.get(card.artist);
    if (illustratorArray) {
      illustratorArray.push(card);
      this.illustratorMap.set(card.artist, illustratorArray);
    } else {
      const newIllustratorArray: CardAPI[] = [];
      newIllustratorArray.push(card);
      this.illustratorMap.set(card.artist, newIllustratorArray);
    }
  }

  setQuality (card: CardAPI) {
    const qualityArray: CardAPI[] = this.qualityMap.get(card.cardCSV.quality);
    if (qualityArray) {
      qualityArray.push(card);
      this.qualityMap.set(card.cardCSV.quality, qualityArray);
    } else {
      const newQualityArray: CardAPI[] = [];
      newQualityArray.push(card);
      this.qualityMap.set(card.cardCSV.quality, newQualityArray);
    }
  }

  setRarity (card: CardAPI) {
    const rarityArray: CardAPI[] = this.rarityMap.get(card.rarity);
    if (rarityArray) {
      rarityArray.push(card);
      this.rarityMap.set(card.rarity, rarityArray);
    } else {
      const newRarityArray: CardAPI[] = [];
      newRarityArray.push(card);
      this.rarityMap.set(card.rarity, newRarityArray);
    }
  }

  configureArrays (map: Map<string, any[]>, array: any[], indexArray: any[]) {
    let auxiliar = {};
    map.forEach((value: any[], key: string) => {
      auxiliar[key] = value;
      indexArray.push(key);
    });
    indexArray.sort();
    array.push(auxiliar);
  }

  openModal(key: string, type: string) {
    switch (type) {
      case 'pokemon':
        this.dialogService.open(InfoDialogComponent, {
          header: 'Cards in this section',
          width: '70%',
          autoZIndex: false,
          style: {"z-index": 3},
          data: this.pokemonMap.get(key)
        });
        break;
      case 'trainer':
        this.dialogService.open(InfoDialogComponent, {
          header: 'Cards in this section',
          width: '70%',
          autoZIndex: false,
          style: {"z-index": 3},
          data: this.trainerMap.get(key)
        });
        break;
      case 'energy':
        this.dialogService.open(InfoDialogComponent, {
          header: 'Cards in this section',
          width: '70%',
          autoZIndex: false,
          style: {"z-index": 3},
          data: this.energyMap.get(key)
        });
        break;
      case 'stage':
        this.dialogService.open(InfoDialogComponent, {
          header: 'Cards in this section',
          width: '70%',
          autoZIndex: false,
          style: {"z-index": 3},
          data: this.stagesMap.get(key)
        });
        break;
      case 'collection':
        this.dialogService.open(InfoDialogComponent, {
          header: 'Cards in this section',
          width: '70%',
          autoZIndex: false,
          style: {"z-index": 3},
          data: this.collectionMap.get(key)
        });
        break;
      case 'rarity':
        this.dialogService.open(InfoDialogComponent, {
          header: 'Cards in this section',
          width: '70%',
          autoZIndex: false,
          style: {"z-index": 3},
          data: this.rarityMap.get(key)
        });
        break;
      case 'quality':
        this.dialogService.open(InfoDialogComponent, {
          header: 'Cards in this section',
          width: '70%',
          autoZIndex: false,
          style: {"z-index": 3},
          data: this.qualityMap.get(key)
        });
        break;
      case 'noPrice':
        this.dialogService.open(InfoDialogComponent, {
          header: 'Cards in this section',
          width: '70%',
          autoZIndex: false,
          style: {"z-index": 3},
          data: this.noPrice
        });
        break;
      case 'illustrator':
        this.dialogService.open(InfoDialogComponent, {
          header: 'Cards in this section',
          width: '70%',
          autoZIndex: false,
          style: {"z-index": 3},
          data: this.illustratorMap.get(key)
        });
        break;
    }
  }

  getCollectionName (key: string) {
    const func = new CollectionsFunctions();
    return func.getCollectionByIdentifier(key);
  }

}
