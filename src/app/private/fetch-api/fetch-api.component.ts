import { Component, OnInit } from '@angular/core';
import {LigaPokemonService} from "../../services/liga-pokemon.service";
import {HttpServiceService} from "../../services/http-service.service";
import {ApiCardService} from "../../services/api-card.service";
import {MessageService} from "primeng/api";
import {CSVCard} from "../../models/CSVCard";
import {CardAPI} from "../../models/cardAPI";

@Component({
  selector: 'app-fetch-api',
  templateUrl: './fetch-api.component.html',
  styleUrls: ['./fetch-api.component.css'],
  providers: [MessageService]
})
export class FetchApiComponent implements OnInit {

  multipleCardsFound: CardAPI[];
  rowGroupMetadata: any;
  selectedCard: CardAPI;
  loading = true;

  constructor(private ligaPokemonService: LigaPokemonService,
              private httpService: HttpServiceService,
              private apiCardService: ApiCardService,
              private messageService: MessageService) { }

  ngOnInit(): void {}

  convert() {
    this.messageService.add({
      severity: 'info',
      summary: 'Fetching...',
      detail: 'fetching cards in the api (from LigaPokemon)'
    });
    this.apiCardService.deleteAll().then(() => {
      this.ligaPokemonService.getAll().subscribe(ligaPokemon => {
        ligaPokemon.forEach(entry => {
          const cardCSV = <CSVCard>entry.cardCSV;

          if (cardCSV.edition.image != null && cardCSV.edition.image != '') {
            let identifier;
            if (cardCSV.cardNumber.match(/[A-Za-z]/))  {
              identifier = cardCSV.edition.image + '-' + cardCSV.cardNumber;
            } else {
              identifier = cardCSV.edition.image + '-' + Number(cardCSV.cardNumber);
            }
            this.httpService.getCard(identifier).subscribe(response => {
              if (response.data != null) {
                response.data.cardCSV = cardCSV;
                this.apiCardService.insert(response.data);
              }
            });
          } else {
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
                    severity: 'warning',
                    summary: 'Multiple cards found',
                    detail: 'adding ' + cardCSV.cardName + '(' + cardCSV.cardNumber + ') to the multiples list.'
                  });
                  if (this.multipleCardsFound == null) {
                    this.multipleCardsFound = [];
                  }
                  response.data.forEach(item => {
                    item.cardCSV = cardCSV;
                    this.multipleCardsFound.push(item);
                  });
                } else {
                  this.messageService.add({
                    severity: 'warning',
                    summary: 'No card found, searching only for the name',
                    detail: 'adding ' + cardCSV.cardName + '(' + cardCSV.cardNumber + ') to the multiples list.'
                  });
                  if (cardCSV.cardName.includes(' ')) {
                    query = 'name:"' + cardCSV.cardName + '"';
                  } else {
                    query = 'name:' + cardCSV.cardName;
                  }
                  this.httpService.searchForCard(query).subscribe(response => {
                    response.data.forEach( item => {
                      if (this.multipleCardsFound == null) {
                        this.multipleCardsFound = [];
                      }
                      item.cardCSV = cardCSV;
                      this.multipleCardsFound.push(item);
                    });
                  });
                }
              }
            });
          }
        });
        this.loading = false;
        this.updateRowGroupMetaData();
        this.messageService.add({
          severity: 'success',
          summary: 'Fetch successful',
          detail: 'all items from LigaPokemon were successfully fetched in the api.'
        });
      });
    });
  }

  onSort() {
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
      severity: 'info',
      summary: 'Sending..',
      detail: 'Sending ' + event.data.name + ' to database.'
    });
    this.apiCardService.insert(event.data);
    this.messageService.add({
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

}
