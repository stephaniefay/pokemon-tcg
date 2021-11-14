import { Component, OnInit } from '@angular/core';
import {ApiCardService} from "../../services/api-card.service";
import {ConfirmationService, MessageService, SortEvent} from "primeng/api";
import {LigaPokemonService} from "../../services/liga-pokemon.service";
import {CardAPIDB} from "../../models/interfaces/cardApiDB";
import {AddCardComponent} from "../add-card/add-card.component";
import {DialogService} from "primeng/dynamicdialog";
import {HttpServiceService} from "../../services/http-service.service";

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
  extras: any;
  subtypes: any;
  submitted: boolean;
  pageSize: number = 10;
  pageSizeArray: any;

  constructor(private apiCardService: ApiCardService,
              private ligaCardService: LigaPokemonService,
              private requestService: HttpServiceService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService,
              public dialogService: DialogService) { }

  ngOnInit(): void {
    this.extras = ['Foil', 'Reverse Foil', 'Promo', 'Altered', 'Edition One', 'Pre Release', 'Oversize'];
    this.subtypes = ["BREAK", "Baby", "Basic", "EX", "GX", "Goldenrod Game Corner", "Item", "LEGEND", "Level-Up", "MEGA", "Pokémon Tool", "Pokémon Tool F",
      "Rapid Strike", "Restored", "Rocket's Secret Machine", "Single Strike", "Special", "Stadium", "Stage 1", "Stage 2", "Supporter", "TAG TEAM",
      "Technical Machine", "V", "VMAX"]


    this.apiCardService.getAll().subscribe(result => {
      this.cards = result;
    });

    this.pageSizeArray = [
      {name: '10 rows', value: 10},
      {name: '20 rows', value: 20},
      {name: '50 rows', value: 50},
      {name: '100 rows', value: 100}
    ];
  }

  editCard(card: CardAPIDB) {
    this.card = {...card};
    console.log(this.card.key);
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
      this.card.cardApi.cardCSV.dateImport = new Date().getTime();
      if (this.card.cardApi.cardCSV.key) {
        this.ligaCardService.update(this.card.cardApi.cardCSV, this.card.cardApi.cardCSV.key);
        this.apiCardService.update(this.card.cardApi, this.card.key)
      } else {
        const observer = this.ligaCardService.getByCard(this.card.cardApi.cardCSV.cardName).subscribe(result => {
          const temp = result.filter(val =>
            ((val.cardCSV.extras && this.card.cardApi.cardCSV.extras) ? val.cardCSV.extras.sort().join(' ') == this.card.cardApi.cardCSV.extras.sort().join(' ') : (val.cardCSV.extras == this.card.cardApi.cardCSV.extras)) &&
            val.cardCSV.language == this.card.cardApi.cardCSV.language &&
            val.cardCSV.quality == this.card.cardApi.cardCSV.quality &&
            val.cardCSV.cardName == this.card.cardApi.cardCSV.cardName &&
            val.cardCSV.cardNumber == this.card.cardApi.cardCSV.cardNumber &&
            val.cardCSV.edition.name == this.card.cardApi.cardCSV.edition.name
          );

          const pop = temp.pop();
          this.card.cardApi.cardCSV.key = pop.key;
          observer.unsubscribe();
          this.ligaCardService.update(this.card.cardApi.cardCSV, this.card.cardApi.cardCSV.key);
          this.apiCardService.update(this.card.cardApi, this.card.key)
        });
      }
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

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  openNew() {
    this.dialogService.open(AddCardComponent, {
      header: 'Add cards',
      width: '90%',
      autoZIndex: false,
      style: {"z-index": 3}
    });
  }

  async updatePrices() {
    const cloneCards: CardAPIDB[] = this.cards;

    while (cloneCards.length > 0) {
      const index = cloneCards.length - 1;
      const request = await this.requestService.getCard(cloneCards[index].cardApi.id).toPromise();

      try {
        cloneCards[index].cardApi.tcgplayer = request.data.tcgplayer;
        this.apiCardService.update(cloneCards[index].cardApi, cloneCards[index].key);
      } catch (e) {
        const cardCSV = cloneCards[index].cardApi.cardCSV;
        cloneCards[index].cardApi = request.data;
        cloneCards[index].cardApi.cardCSV = cardCSV;
        this.apiCardService.update(cloneCards[index].cardApi, cloneCards[index].key);
      }
      const cardAPIDB = cloneCards.pop();
      console.log('updated: ' + cardAPIDB.key);
    }

    this.messageService.add({
      key: 'tc',
      severity: 'success',
      summary: 'Cards Updated',
      detail: '',
      life: 3000
    });
  }
}
