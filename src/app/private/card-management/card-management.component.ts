import { Component, OnInit } from '@angular/core';
import {CardAPI} from "../../models/cardAPI";
import {ApiCardService} from "../../services/api-card.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {LigaPokemonService} from "../../services/liga-pokemon.service";
import {CardAPIDB} from "../../models/interfaces/cardApiDB";

@Component({
  selector: 'app-card-management',
  templateUrl: './card-management.component.html',
  styleUrls: ['./card-management.component.scss'],
  providers: [MessageService, ConfirmationService]

})
export class CardManagementComponent implements OnInit {

  cards: CardAPIDB[];
  cardDialog: boolean;
  card: CardAPIDB;
  submitted: boolean;

  constructor(private apiCardService: ApiCardService,
              private ligaCardService: LigaPokemonService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) { }

  ngOnInit(): void {

    this.apiCardService.getAll().subscribe(result => {
      this.cards = result;
    });
  }

  editCard(card: CardAPIDB) {
    this.card = {...card};
    this.cardDialog = true;
  }

  deleteCard(card: CardAPIDB) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + card.cardApi.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiCardService.delete(card.key);
        this.ligaCardService.delete(card.cardApi.cardCSV.key);
        this.cards = this.cards.filter(val => val.key !== card.key);
        this.card = null;
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Card Deleted', life: 3000});
        if (this.cardDialog) {
          this.hideDialog()
        }
      }
    });
  }

  hideDialog() {
    this.cardDialog = false;
    this.submitted = false;
  }

  saveCard() {
    this.submitted = true;
    if (this.card.cardApi.cardCSV.quantity > 0) {
      this.apiCardService.update(this.card.cardApi, this.card.key)
      this.ligaCardService.update(this.card.cardApi.cardCSV, this.card.cardApi.cardCSV.key);
    } else {
      this.deleteCard(this.card)
    }
    this.hideDialog();
  }

  getExtras(card: CardAPIDB) {
    let extrasString = '';
    if (card.cardApi.cardCSV.extras != null) {
      card.cardApi.cardCSV.extras.forEach(value => {
        extrasString += value + ', ';
      });
      extrasString = extrasString.slice(0, -2);
    }
    return extrasString;
  }

}
