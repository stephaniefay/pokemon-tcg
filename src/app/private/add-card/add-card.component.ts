import { Component, OnInit } from '@angular/core';
import {Collections, CollectionsFunctions} from "../../models/collections";
import {ApiSearch} from "../../models/interfaces/apiSearch";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {HttpServiceService} from "../../services/http-service.service";
import {CardAPI} from "../../models/cardAPI";
import {CSVCard} from "../../models/CSVCard";
import {ApiCardService} from "../../services/api-card.service";
import {LigaPokemonService} from "../../services/liga-pokemon.service";

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AddCardComponent implements OnInit {

  constructor(private apiCardService: ApiCardService,
              private ligaCardService: LigaPokemonService,
              public ref: DynamicDialogRef,
              public config: DynamicDialogConfig,
              public service: HttpServiceService) { }

  cardName: string;
  typeChosen: string;
  collectionChosen: string;
  supertypeChosen: string;
  types: any;
  supertypes: any;
  collections: any;
  qualities: any;
  languages: any;
  extras: any;
  loading: boolean = false;
  page: number = 1;
  selectedCard: CardAPI;
  cards: ApiSearch;
  displayDialog: boolean = false;

  ngOnInit(): void {
    this.supertypes = [
      { label: "Pokémon", code: "Pokémon" },
      { label: "Trainer", code: "Trainer" },
      { label: "Energy", code: "Energy" }
    ];

    this.types = [
      { label: "Colorless", code: "Colorless" },
      { label: "Darkness", code: "Darkness" },
      { label: "Dragon", code: "Dragon" },
      { label: "Fairy", code: "Fairy" },
      { label: "Fighting", code: "Fighting" },
      { label: "Fire", code: "Fire" },
      { label: "Grass", code: "Grass" },
      { label: "Lightning", code: "Lightning" },
      { label: "Metal", code: "Metal" },
      { label: "Psychic", code: "Psychic" },
      { label: "Water", code: "Water" }
    ];

    this.qualities = ['M', 'NM', 'SP', 'MP', 'HP', 'D'];
    this.languages = ['BR', 'EN', 'DE', 'ES', 'FR', 'IT', 'JP', 'KO', 'RU', 'TW'];
    this.extras = ['Foil', 'Reverse Foil', 'Promo', 'Altered', 'Edition One', 'Pre Release', 'Oversize'];

    const collectionsFunctions = new CollectionsFunctions();
    const allKeys = collectionsFunctions.getAllKeys();

    this.collections = [];
    allKeys.forEach(key => {
      this.collections.push({ label: Collections[key].label, code: Collections[key].value});
    });
  }

  addCard (card:CardAPI) {
    this.selectedCard = card;
    this.selectedCard.cardCSV = new CSVCard();
    this.selectedCard.cardCSV.cardName = card.name;
    this.selectedCard.cardCSV.cardNumber = card.number;
    this.selectedCard.cardCSV.edition = { name: card.set.name, image: card.set.id };
    this.selectedCard.cardCSV.rarity = this.getRarity(card.rarity);

    this.displayDialog = true;
  }

  getRarity (rarity: string) {
    if (rarity.trim() == '') return '';
    switch (rarity) {
      case 'Common':
        return 'C';
      case 'Uncommon':
        return 'U';
      case 'Rare':
        return 'R';
      case 'Rare Holo':
        return 'RH';
      case 'Rare Holo EX':
        return 'RE';
      case 'Rare Holo Lv.X':
        return 'RL';
      case 'Rare Ultra':
        return 'RU';
      case 'Rare Prime':
        return 'RP';
      case 'Rare ACE':
        return 'RA';
      case 'Legend':
        return 'L';
      case 'Secret Rare / Promo':
        return 'S';
      case 'Amazing Rare':
        return 'AR';
      case 'Hyper Rare':
        return 'HR';
      case 'Shiny Rare':
        return 'SR';
      default:
          return '';

    }
  }

  hideDialog() {
    this.displayDialog = false;
  }

  saveCard() {
    this.selectedCard.cardCSV.dateImport = new Date().getTime();
    this.apiCardService.insert(this.selectedCard);
    this.ligaCardService.insert(this.selectedCard.cardCSV);
    this.displayDialog = false;
  }

  getCount() {
    let count = (this.page - 1) * 20;
    return count + this.cards.count;
  }

  newSearch() {
    this.page = 1;
    this.search();
  }

  search() {
    this.loading = true;
    let query = "";
    if (this.cardName) {
      query += "name:";
      if (this.cardName.includes(" ")) {
        query += '"' + this.cardName + '"';
      } else {
        query += this.cardName;
      }
    }

    if (this.typeChosen) {
      if (query != "") query += " ";
      query += "types:" + this.typeChosen['code'];
    }

    if (this.collectionChosen) {
      if (query != "") query += " ";
      query += "set.id:" + this.collectionChosen['code'];
    }

    if (this.supertypeChosen) {
      if (query != "") query += " ";
      query += "supertype:" + this.supertypeChosen['code'];
    }

    this.service.searchForCard(query + "&page=" + this.page + "&pageSize=20").subscribe(result => {
      this.cards = result;
      this.loading = false;
    });
  }

  hasNext() {
    return (this.page + 1) * 20 <= this.cards.totalCount + 20;
  }

  hasPrevious() {
    return this.page > 1;
  }

  nextPage() {
    this.page++;
    this.search();
  }

  previousPage() {
    this.page--;
    this.search();
  }

}
