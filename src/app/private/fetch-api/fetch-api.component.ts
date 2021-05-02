import { Component, OnInit } from '@angular/core';
import {LigaPokemonService} from "../../services/liga-pokemon.service";
import {HttpServiceService, SearchCardAPIMultiple} from "../../services/http-service.service";
import {ApiCardService} from "../../services/api-card.service";
import {MessageService} from "primeng/api";
import {CSVCard} from "../../models/CSVCard";
import {CardAPI} from "../../models/cardAPI";
import {interval} from "rxjs";

export interface cardCSVDB {
  key: string;
  cardCSV: CSVCard;
}

export class MultipleCards {
  index: string;
  name: string;
  number: string;
  edition: string;
  extras: string;
  multiples: CardAPI[];
}

@Component({
  selector: 'app-fetch-api',
  templateUrl: './fetch-api.component.html',
  styleUrls: ['./fetch-api.component.scss'],
  providers: [MessageService]
})

export class FetchApiComponent implements OnInit {

  multipleCardsFound: MultipleCards[];
  cardsCSV: cardCSVDB[];
  errorCards: CSVCard[] = [];
  cardsProcessed = 0;
  totalCards = 0;
  limitRateAPI;
  disabled = false;
  observable;
  selectedCard: CardAPI;
  loading = true;
  loadingCSV = true;

  constructor(private ligaPokemonService: LigaPokemonService,
              private httpService: HttpServiceService,
              private apiCardService: ApiCardService,
              private messageService: MessageService) { }

  ngOnInit(): void {}

  convert() {
    this.disabled = true;
    this.messageService.add({
      key: 'tc',
      severity: 'info',
      summary: 'Fetching...',
      detail: 'fetching cards in the api (from LigaPokemon)'
    });
    this.apiCardService.deleteAll().then(() => {
      this.ligaPokemonService.getAll().subscribe(ligaPokemon => {
        this.cardsCSV = ligaPokemon;
        this.loadingCSV = false;
        this.totalCards = this.cardsCSV.length;
      });
    });

    this.observable = interval(5000).subscribe(async x => {
      if (this.cardsCSV && this.cardsCSV.length > 0) {
        this.limitRateAPI = 50;
        while (this.limitRateAPI > 0 && this.cardsCSV.length > 0) {
          const index = this.cardsCSV.length - 1;
          this.cardsCSV[index].cardCSV.key = this.cardsCSV[index].key;
          const promise = await this.fetchFromAPI(this.cardsCSV[index].cardCSV);
          this.limitRateAPI -= 1;
          this.cardsCSV.pop();
          this.cardsProcessed += 1;
        }
      } else {
        this.messageService.add({
          key: 'tc',
          severity: 'success',
          summary: 'Fetch successful',
          detail: 'all items from LigaPokemon were successfully fetched in the api.'
        });
        this.loading = false;
        this.observable.unsubscribe();
        if (this.errorCards.length > 0) {
          this.processErrors();
        }
      }
    });
  }

  processErrors () {
    this.messageService.add({
      key: 'tc',
      severity: 'warn',
      summary: 'There were some errors, trying to process it',
      detail: 'automatically processing errors found'
    });
    this.totalCards = this.errorCards.length;
    this.cardsProcessed = 0;
    this.observable = interval(5000).subscribe(async x => {
      if (this.errorCards.length > 0) {
        this.limitRateAPI = 10;
        while (this.limitRateAPI > 0 && this.errorCards.length > 0) {
          const index = this.errorCards.length - 1;
          const promise = await this.fetchFromAPIByQuery(this.errorCards[index]);
          this.limitRateAPI -= 1;
          this.errorCards.pop();
          this.cardsProcessed += 1;
        }
      } else {
        this.messageService.add({
          key: 'tc',
          severity: 'success',
          summary: 'Errors Processed!',
          detail: 'all items from error list fetched!'
        });
        this.observable.unsubscribe();
      }
    });
  }

  addToMultiple (response: SearchCardAPIMultiple, card: CSVCard) {
    if (this.multipleCardsFound == null) {
      this.multipleCardsFound = [];
    }
    const multiple = new MultipleCards();
    multiple.index = card.key;
    multiple.name = card.cardName;
    multiple.number = card.cardNumber;
    multiple.edition = card.edition.name;
    multiple.extras = (card.extras != null) ? card.extras.toString() : '';

    const arrayMultiple: CardAPI[] = [];

    response.data.forEach(item => {
      item.cardCSV = card;
      arrayMultiple.push(item);
    });

    multiple.multiples = arrayMultiple;
    this.multipleCardsFound.push(multiple);
  }

  async fetchFromAPIByQuery (cardCSV: CSVCard) {
    let query;
    if (cardCSV.cardName.includes(' ')) {
      query = 'name:"' + cardCSV.cardName + '" number:' + cardCSV.cardNumber;
    } else {
      query = 'name:' + cardCSV.cardName + ' number:' + cardCSV.cardNumber;
    }
    let response = await this.httpService.searchForCard(query).toPromise();

    if (response.count == 1) {
      response.data[0].cardCSV = cardCSV;
      this.apiCardService.insert(response.data[0]);
    } else {
      if (response.data.length > 1) {
        this.messageService.add({
          key: 'tc',
          severity: 'warn',
          summary: 'Multiple cards found',
          detail: 'adding ' + cardCSV.cardName + '(' + cardCSV.cardNumber + ') to the multiples list.'
        });

        this.addToMultiple(response, cardCSV);
      } else {
        this.messageService.add({
          key: 'tc',
          severity: 'warn',
          summary: 'No card found',
          detail: 'searching only for the name (' + cardCSV.cardName + ')'
        });
        if (cardCSV.cardName.includes(' ')) {
          query = 'name:"' + cardCSV.cardName + '"';
        } else {
          query = 'name:' + cardCSV.cardName;
        }
        response = await this.httpService.searchForCard(query).toPromise();

        this.addToMultiple(response, cardCSV);
      }
    }
  }

  async fetchFromAPI(cardCSV: CSVCard) {
    if (cardCSV.edition.image != null && cardCSV.edition.image != '') {
      let identifier;
      if (cardCSV.cardNumber.match(/[A-Za-z]/)) {
        identifier = cardCSV.edition.image + '-' + cardCSV.cardNumber;
      } else {
        identifier = cardCSV.edition.image + '-' + Number(cardCSV.cardNumber);
      }
      this.httpService.getCard(identifier).subscribe(response => {
        if (response.data != null) {
          response.data.cardCSV = cardCSV;
          this.apiCardService.insert(response.data);
        }
      }, error => {
        this.errorCards.push(cardCSV);
      });
    } else {
      const promise = await this.fetchFromAPIByQuery(cardCSV);
    }
  }

  onRowSelect(card: MultipleCards) {
    this.messageService.add({
      key: 'tc',
      severity: 'info',
      summary: 'Sending..',
      detail: 'Sending ' + this.selectedCard.name + ' to database.'
    });

    this.apiCardService.insert(this.selectedCard);
    this.messageService.add({
      key: 'tc',
      severity: 'success',
      summary: 'Sent!',
      detail: this.selectedCard.name + ' sent!'
    });

    this.multipleCardsFound.forEach((element,index)=>{
      if(element.name == card.name) this.multipleCardsFound.splice(index,1);
    });

    this.selectedCard = null;
  }

  getNumber (card: cardCSVDB) {
    return card.cardCSV.cardNumber;
  }

  getName (card: cardCSVDB) {
    return card.cardCSV.cardName;
  }

  getCollection (card: cardCSVDB) {
    return card.cardCSV.edition.name;
  }

  getNumberCard (card: CSVCard) {
    return card.cardNumber;
  }

  getNameCard (card: CSVCard) {
    return card.cardName;
  }

  getCollectionCard (card: CSVCard) {
    return card.edition.name;
  }

}
