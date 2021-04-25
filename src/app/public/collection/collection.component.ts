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
      this.cards = data;
      this.loading = false;
    });

    this.sortOptions = [
      {label: 'Price High to Low', value: '!price'},
      {label: 'Price Low to High', value: 'price'}
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

  getPrice (card:CardAPI) {
    console.log(card);
  }

}
