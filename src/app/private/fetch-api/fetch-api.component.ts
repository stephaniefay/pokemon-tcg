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
            const identifier = cardCSV.edition.image + '-' + cardCSV.cardNumber;
            this.httpService.getCard(identifier).subscribe(response => {
              this.apiCardService.insert(response);
            });
          } else {
            const query = '!name:' + cardCSV.cardName + ' !number:' + cardCSV.cardNumber;
            this.httpService.searchForCard(query).subscribe(response => {
              if (response.data.length == 1) {
                this.apiCardService.insert(response.data[0]);
              } else {
                if (this.multipleCardsFound == null) {
                  this.multipleCardsFound = [];
                }
                response.data.forEach(item => {
                  this.messageService.add({
                    severity: 'warning',
                    summary: 'Multiple cards found',
                    detail: 'adding ' + item.name + ' to the multiples list.'
                  });
                  this.multipleCardsFound.push(item);
                });
              }
            });
          }
        });
        this.loading = false;
        this.updateRowGroupMetaData();
        this.messageService.add({
          severity: 'success',
          summary: 'Fetch successfull',
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
  }

}
