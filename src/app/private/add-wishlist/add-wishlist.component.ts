import { Component, OnInit } from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {HttpServiceService} from "../../services/http-service.service";
import {WishlistService} from "../../services/wishlist.service";
import {CardAPI} from "../../models/cardAPI";
import {ApiSearch} from "../../models/interfaces/apiSearch";
import {Collections, CollectionsFunctions} from "../../models/collections";

@Component({
  selector: 'app-add-wishlist',
  templateUrl: './add-wishlist.component.html',
  styleUrls: ['./add-wishlist.component.scss']
})
export class AddWishlistComponent implements OnInit {

  constructor(public ref: DynamicDialogRef,
              public config: DynamicDialogConfig,
              public service: HttpServiceService,
              public wishlist: WishlistService) { }

  cardName: string;
  typeChosen: string;
  collectionChosen: string;
  supertypeChosen: string;
  types: any;
  supertypes: any;
  collections: any;
  qualities: any;
  languages: any;
  loading: boolean = false;
  page: number = 1;
  selectedCard: CardAPI;
  cards: ApiSearch;

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

    const collectionsFunctions = new CollectionsFunctions();
    const allKeys = collectionsFunctions.getAllKeys();

    this.collections = [];
    allKeys.forEach(key => {
      this.collections.push({ label: Collections[key].label, code: Collections[key].value});
    });
  }

  addCard (card:CardAPI) {
    this.wishlist.insert(card);
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
