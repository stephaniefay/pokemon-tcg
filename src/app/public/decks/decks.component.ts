import { Component, OnInit } from '@angular/core';
import {DecksService} from "../../services/decks.service";
import {AngularFireAuth} from "@angular/fire/auth";
import {ConfirmationService, MessageService} from "primeng/api";
import {DeckDB} from "../../models/interfaces/deckDB";
import {DialogService} from "primeng/dynamicdialog";
import {DeckBuilderComponent} from "../../private/deck-builder/deck-builder.component";
import {InfoDeckDialogComponent} from "../info-deck-dialog/info-deck-dialog.component";

@Component({
  selector: 'app-decks',
  templateUrl: './decks.component.html',
  styleUrls: ['./decks.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class DecksComponent implements OnInit {

  constructor(private service: DecksService,
              public dialogService: DialogService,
              public auth: AngularFireAuth) { }

  decks: DeckDB[];
  deckDialog: boolean;
  deck: DeckDB;
  submitted: boolean;

  ngOnInit(): void {
    this.service.getAll().subscribe(result => {
      this.decks = result;
    });
  }

  openBuilder() {
    this.dialogService.open(DeckBuilderComponent, {
      header: 'Deck Builder',
      width: '100%',
      autoZIndex: false,
      style: {"z-index": 3}
    });
  }

  viewDeck (deck: DeckDB) {
    this.dialogService.open(InfoDeckDialogComponent, {
      header: 'Cards in this section',
      width: '70%',
      autoZIndex: false,
      style: {"z-index": 3},
      data: deck.deck.cards
    });
  }

  editDeck (deck: DeckDB) {
    console.log('edit deck');
  }

  deleteDeck (deck: DeckDB) {
    console.log('delete deck');
  }

}
