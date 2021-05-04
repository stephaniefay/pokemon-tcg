import { Component, OnInit } from '@angular/core';
import {LigaPokemonService} from "../../services/liga-pokemon.service";
import {HttpServiceService, SearchCardAPIMultiple} from "../../services/http-service.service";
import {ApiCardService} from "../../services/api-card.service";
import {MessageService} from "primeng/api";
import {CSVCard} from "../../models/CSVCard";
import {CardAPI} from "../../models/cardAPI";

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
  cardsMultipleProcessed = 0;
  totalCards = 0;
  totalMultipleCards = 0;
  limitRateAPI;
  disabled = false;
  observable;
  selectedCard: CardAPI;
  loading = true;
  loadingCSV = true;
  loadingErrors = true;

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
      this.ligaPokemonService.getAll().subscribe(async ligaPokemon => {
        this.cardsCSV = ligaPokemon;
        this.cardsCSV.forEach(card => {
          this.totalMultipleCards += card.cardCSV.quantity;
        });
        this.loadingCSV = false;
        this.totalCards = this.cardsCSV.length;

        while (this.cardsCSV.length > 0) {
          const index = this.cardsCSV.length - 1;
          this.cardsCSV[index].cardCSV.key = this.cardsCSV[index].key;
          const fetchFromAPI = await this.fetchFromAPI(this.cardsCSV[index].cardCSV);
          this.cardsProcessed += 1;
          const cardCSV = this.cardsCSV.pop().cardCSV;
          this.cardsMultipleProcessed += cardCSV.quantity;
        }
        this.messageService.add({
          key: 'tc',
          severity: 'success',
          summary: 'Fetch successful',
          detail: 'all items from LigaPokemon were successfully fetched in the api.'
        });
        this.loadingCSV = false;
        if (this.errorCards.length > 0) {
          const processErrors = await this.processErrors();
        } else {
          this.loading = false;
        }
      });
    });
  }

  async processErrors() {
    this.messageService.add({
      key: 'tc',
      severity: 'warn',
      summary: 'There were some errors, trying to process it',
      detail: 'automatically processing errors found'
    });
    this.totalCards = 0;
    this.totalMultipleCards = 0;
    this.cardsMultipleProcessed = 0;
    this.cardsProcessed = 0;

    this.errorCards.forEach(card => {
      console.log(card);
      this.totalCards += 1;
      this.totalMultipleCards += card.quantity;
    });

    while (this.errorCards.length > 0) {
      const index = this.errorCards.length - 1;
      const promise = await this.fetchFromAPIByQuery(this.errorCards[index]);
      this.limitRateAPI -= 1;
      this.cardsProcessed += 1;
      const errorCard = this.errorCards.pop();
      this.cardsMultipleProcessed += errorCard.quantity;
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
