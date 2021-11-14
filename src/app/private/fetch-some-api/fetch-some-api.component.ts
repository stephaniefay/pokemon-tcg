import { Component, OnInit } from '@angular/core';
import {CSVCard} from "../../models/CSVCard";
import {CardAPI} from "../../models/cardAPI";
import {MessageService} from "primeng/api";
import {LigaPokemonService} from "../../services/liga-pokemon.service";
import {HttpServiceService} from "../../services/http-service.service";
import {ApiCardService} from "../../services/api-card.service";
import {cardCSVDB} from "../../models/interfaces/ligaPokemonDB";
import {ApiSearch} from "../../models/interfaces/apiSearch";

export class MultipleCards {
  index: string;
  name: string;
  number: string;
  edition: string;
  extras: string;
  multiples: CardAPI[];
}

@Component({
  selector: 'app-fetch-some-api',
  templateUrl: './fetch-some-api.component.html',
  styleUrls: ['./fetch-some-api.component.scss'],
  providers: [MessageService]
})
export class FetchSomeApiComponent implements OnInit {

  multipleCardsFound: MultipleCards[];
  cardsCSV: cardCSVDB[];
  errorCards: CSVCard[] = [];
  cardsProcessed = 0;
  totalCards = 0;
  multipleCardsProcessed = 0;
  disabled = false;
  selectedCard: CardAPI;
  loading = true;
  loadingCSV = true;
  loadingErrors = true;
  date: Date;

  constructor(private ligaPokemonService: LigaPokemonService,
              private httpService: HttpServiceService,
              private apiCardService: ApiCardService,
              private messageService: MessageService) { }

  ngOnInit(): void {

  }

  async convert() {
    if (this.date != null) {
      this.disabled = true;
      this.messageService.add({
        key: 'tc',
        severity: 'info',
        summary: 'Fetching...',
        detail: 'fetching cards in the api (from LigaPokemon)'
      });

      const timestamp = this.date.getTime();

      const service = this.ligaPokemonService.getByTime(timestamp).subscribe(result => {
        this.cardsCSV = result;
        service.unsubscribe();
        this.startImporting();
      });
    }
  }

  async startImporting() {
    this.totalCards = this.cardsCSV.length;
    this.cardsCSV.forEach(card => {
      card.cardCSV.key = card.key;
      const service = this.apiCardService.searchByChild('cardCSV/key', card.key).subscribe(result => {
        service.unsubscribe();
        if (result.length == 1) {
          let api = result.pop();
          api.cardApi.cardCSV = card.cardCSV;
          this.apiCardService.update(api.cardApi, api.key);
        } else if (result.length == 0) {
          this.fetchFromAPI(card.cardCSV);
        }
        this.cardsProcessed += 1;
        this.multipleCardsProcessed += card.cardCSV.quantity;
      });
    });
    this.messageService.add({
      key: 'tc',
      severity: 'success',
      summary: 'Fetch successful',
      detail: 'all items from LigaPokemon were successfully fetched in the api.'
    });
    this.cardsCSV = null;

    this.loadingCSV = false;
    if (this.errorCards.length > 0) {
      const processErrors = await this.processErrors();
    } else {
      this.loading = false;
    }
  }


  async processErrors() {
    this.messageService.add({
      key: 'tc',
      severity: 'warn',
      summary: 'There were some errors, trying to process it',
      detail: 'automatically processing errors found'
    });
    this.totalCards = this.errorCards.length;
    this.multipleCardsProcessed = 0;
    this.cardsProcessed = 0;

    while (this.errorCards.length > 0) {
      const index = this.errorCards.length - 1;
      const promise = await this.fetchFromAPIByQuery(this.errorCards[index]);
      this.cardsProcessed += 1;
      const errorCard = this.errorCards.pop();
      this.multipleCardsProcessed += errorCard.quantity;
    }

    this.messageService.add({
      key: 'tc',
      severity: 'success',
      summary: 'Errors Processed!',
      detail: 'all items from error list fetched!'
    });

    this.loadingErrors = false;
    this.loading = false;
  }

  addToMultiple (response: ApiSearch, card: CSVCard) {
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

  async fetchFromAPIByQuery (card: CSVCard) {
    let query;
    if (card.cardName.includes(' ')) {
      query = 'name:"' + card.cardName + '" number:' + card.cardNumber;
    } else {
      query = 'name:' + card.cardName + ' number:' + card.cardNumber;
    }
    let response = await this.httpService.searchForCard(query).toPromise();
    if (response.count == 1) {
      const data = response.data[0];
      data.cardCSV = card;
      this.apiCardService.insert(data);
    } else {
      if (response.data.length > 1) {
        this.messageService.add({
          key: 'tc',
          severity: 'warn',
          summary: 'Multiple cards found',
          detail: 'adding ' + card.cardName + '(' + card.cardNumber + ') to the multiples list.'
        });

        this.addToMultiple(response, card);
      } else {
        this.messageService.add({
          key: 'tc',
          severity: 'warn',
          summary: 'No card found',
          detail: 'searching only for the name (' + card.cardName + ')'
        });
        if (card.cardName.includes(' ')) {
          query = 'name:"' + card.cardName + '"';
        } else {
          query = 'name:' + card.cardName;
        }
        response = await this.httpService.searchForCard(query).toPromise();
        if (response.count == 0) {
          console.log('no response ');
          console.log(card);
        }

        this.addToMultiple(response, card);
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

      try {
        const searchCardAPIPromise = await this.httpService.getCard(identifier).toPromise();
        if (searchCardAPIPromise.data != null) {
          searchCardAPIPromise.data.cardCSV = cardCSV;
          this.apiCardService.insert(searchCardAPIPromise.data);
        }
      } catch (e) {
        this.errorCards.push(cardCSV);
      }
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
      if(element.index == card.index) {
        const multipleCards = this.multipleCardsFound.splice(index,1);
        console.log(multipleCards);
      }
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
