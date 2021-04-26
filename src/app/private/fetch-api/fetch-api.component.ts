import { Component, OnInit } from '@angular/core';
import {LigaPokemonService} from "../../services/liga-pokemon.service";
import {HttpServiceService} from "../../services/http-service.service";
import {ApiCardService} from "../../services/api-card.service";
import {MessageService} from "primeng/api";
import {CSVCard} from "../../models/CSVCard";
import {CardAPI} from "../../models/cardAPI";
import {interval} from "rxjs";

export interface cardCSVDB {
  key: string;
  cardCSV: CSVCard;
}

@Component({
  selector: 'app-fetch-api',
  templateUrl: './fetch-api.component.html',
  styleUrls: ['./fetch-api.component.scss'],
  providers: [MessageService]
})

export class FetchApiComponent implements OnInit {

  multipleCardsFound: CardAPI[];
  cardsCSV: cardCSVDB[];
  errorCards: CSVCard[] = [];
  cardsProcessed = 0;
  totalCards = 0;
  limitRateAPI;
  disabled = false;
  observable;
  rowGroupMetadata: any;
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

    this.observable = interval(10000).subscribe( x => {
      if (this.cardsCSV.length > 0) {
        this.limitRateAPI = 50;
        while (this.limitRateAPI > 0 && this.cardsCSV.length > 0) {
          const index = this.cardsCSV.length - 1;
          this.fetchFromAPI(this.cardsCSV[index].cardCSV);
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
        this.updateRowGroupMetaData();
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
    this.observable = interval(10000).subscribe(x => {
      if (this.errorCards.length > 0) {
        this.limitRateAPI = 50;
        while (this.limitRateAPI > 0 && this.errorCards.length > 0) {
          const index = this.errorCards.length - 1;
          this.fetchFromAPIByQuery(this.errorCards[index]);
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
        this.updateRowGroupMetaData();
        this.observable.unsubscribe();
      }
    });
  }

  fetchFromAPIByQuery (cardCSV: CSVCard) {
    let query;
    if (cardCSV.cardName.includes(' ')) {
      query = 'name:"' + cardCSV.cardName + '" number:' + cardCSV.cardNumber;
    } else {
      query = 'name:' + cardCSV.cardName + ' number:' + cardCSV.cardNumber;
    }
    this.httpService.searchForCard(query).subscribe(response => {
      if (response.data.length == 1) {
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
          if (this.multipleCardsFound == null) {
            this.multipleCardsFound = [];
          }
          response.data.forEach(item => {
            item.cardCSV = cardCSV;
            if (cardCSV.extras) {
              item.name += ' id: (' + query + ', ' + cardCSV.extras.toString() + ') collection: ' + cardCSV.edition.name;
            } else {
              item.name += ' id: (' + query + ') collection: ' + cardCSV.edition.name;
            }
            this.multipleCardsFound.push(item);
          });
          this.updateRowGroupMetaData();
        } else {
          this.messageService.add({
            key: 'tc',
            severity: 'warn',
            summary: 'No card found, searching only for the name',
            detail: 'adding ' + cardCSV.cardName + '(' + cardCSV.cardNumber + ') to the multiples list.'
          });
          if (cardCSV.cardName.includes(' ')) {
            query = 'name:"' + cardCSV.cardName + '"';
          } else {
            query = 'name:' + cardCSV.cardName;
          }
          this.httpService.searchForCard(query).subscribe(response => {
            response.data.forEach(item => {
              if (this.multipleCardsFound == null) {
                this.multipleCardsFound = [];
              }
              item.cardCSV = cardCSV;
              if (cardCSV.extras) {
                item.name += ' id: (' + query + ', ' + cardCSV.extras.toString() + ') collection: ' + cardCSV.edition.name;
              } else {
                item.name += ' id: (' + query + ') collection: ' + cardCSV.edition.name;
              }
              this.multipleCardsFound.push(item);
            });
          });
        }
      }
    });
  }

  fetchFromAPI (cardCSV: CSVCard) {
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
      this.fetchFromAPIByQuery(cardCSV);
    }
  }

  onSort() {
    this.updateRowGroupMetaData();
  }

  update() {
    this.updateRowGroupMetaData();
  }

  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};

    if (this.multipleCardsFound) {
      for (let i = 0; i < this.multipleCardsFound.length; i++) {
        let rowData = this.multipleCardsFound[i];
        let cardName = rowData.name;

        if (i == 0) {
          this.rowGroupMetadata[cardName] = { index: 0, size: 1 };
        }
        else {
          let previousRowData = this.multipleCardsFound[i - 1];
          let previousRowGroup = previousRowData.name;
          if (cardName === previousRowGroup)
            this.rowGroupMetadata[cardName].size++;
          else
            this.rowGroupMetadata[cardName] = { index: i, size: 1 };
        }
      }
    }
  }

  onRowSelect(event) {
    this.messageService.add({
      key: 'tc',
      severity: 'info',
      summary: 'Sending..',
      detail: 'Sending ' + event.data.name + ' to database.'
    });

    event.data.name = event.data.name.split('id')[0].trim();
    this.apiCardService.insert(event.data);
    this.messageService.add({
      key: 'tc',
      severity: 'success',
      summary: 'Sent!',
      detail: event.data.name + ' sent!'
    });
    var name = event.data.name;
    const newArray = [];
    this.multipleCardsFound.forEach( (item) => {
      if (item.name != name) {
        newArray.push(item);
      }
    });
    this.multipleCardsFound = newArray;
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
