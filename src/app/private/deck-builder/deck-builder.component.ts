import { Component, OnInit } from '@angular/core';
import {CardAPIDB} from "../../models/interfaces/cardApiDB";
import {ApiCardService} from "../../services/api-card.service";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
  selector: 'app-deck-builder',
  templateUrl: './deck-builder.component.html',
  styleUrls: ['./deck-builder.component.scss']
})
export class DeckBuilderComponent implements OnInit {

  sourceCards: CardAPIDB[];

  targetCards: CardAPIDB[] = [];

  cardsInDeck = 0;

  constructor(private service: ApiCardService,
              public ref: DynamicDialogRef,
              public config: DynamicDialogConfig) { }

  ngOnInit(): void {

    this.service.getAll().subscribe(result => {
      this.sourceCards = result;
    });

  }

  getBadge (rarity:string) {
    rarity = rarity.replace(/ /g, '').replace(/\./g, '').toLocaleLowerCase();
    return rarity;
  }

  dealWithCard (event) {

  }

}
