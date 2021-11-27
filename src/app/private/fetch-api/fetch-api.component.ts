import {Component, OnInit, ViewChild} from '@angular/core';
import {LigaPokemonService} from "../../services/liga-pokemon.service";
import {HttpServiceService} from "../../services/http-service.service";
import {ApiCardService} from "../../services/api-card.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {CSVCard} from "../../models/CSVCard";
import {CardAPI} from "../../models/cardAPI";
import {cardCSVDB} from "../../models/interfaces/ligaPokemonDB";
import {ApiSearch} from "../../models/interfaces/apiSearch";
import {CsvReaderService} from "../../services/csv-reader.service";

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
  providers: [ConfirmationService, MessageService]
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
  finishedImporting = false;
  uploadedFiles: any[] = [];

  blocked = false;

  constructor(private ligaPokemonService: LigaPokemonService,
              private httpService: HttpServiceService,
              private apiCardService: ApiCardService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService,
              public csvReader: CsvReaderService) { }

  @ViewChild('uploader') uploader: any;

  ngOnInit(): void {}

  verifyConvert(event) {
    this.confirmationService.confirm({
      message: 'If you want to continue, you will delete all cards in your collection and import those in this file. It will take a long time, please do not close the window or change tabs, because it could cause some strange behaviour.',
      header: 'Confirm',
      icon: 'pi pi-exclamation-circle',
      accept: () => {
        this.uploadFile(event);
      }
    });
  }

  uploadFile (event) {
    let file = event.files[0];

    if (this.csvReader.isValidCSVFile(file)) {
      let reader = new FileReader();
      reader.readAsText(file);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        let headersRow = this.csvReader.getHeaderArray(csvRecordsArray);

        this.csvReader.records = this.csvReader.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
        this.csvReader.totalLines = this.csvReader.records.length;
        this.ligaPokemonService.deleteAll().then(() => {
          this.csvReader.records.forEach(record => {
            this.csvReader.linesRead += 1;
            this.ligaPokemonService.insert(record);
          });
          this.messageService.add({
            severity: 'success',
            summary: 'CSV imported!',
            detail: 'the file was successfully imported to the database!'
          });
          this.fileReset();
          this.finishedImporting = true;
          this.convert();
        });
      };

      reader.onerror = () => {
        this.messageService.add({severity: 'danger', summary: 'Error', detail: 'error occurred while reading file'});
      };

    } else {
      this.messageService.add({severity: 'warn', summary: 'File not supported', detail: 'Please import valid .csv file'});
      this.fileReset();
    }
  }

  fileReset() {
    this.uploader.clear();
  }

  convert() {
    if (!this.blocked) {
      this.disabled = true;
      this.blocked = true;
      this.messageService.add({
        key: 'tc',
        severity: 'info',
        summary: 'Cleaning database...',
        detail: 'cleaning API database'
      });
      this.apiCardService.deleteAll().then(() => {
        this.messageService.add({
          key: 'tc',
          severity: 'info',
          summary: 'Fetching...',
          detail: 'fetching cards imported in LigaPokemon'
        });
        const service = this.ligaPokemonService.getAll().subscribe(async ligaPokemon => {
          service.unsubscribe();
          this.cardsCSV = ligaPokemon;
          this.cardsCSV.forEach(card => {
            this.totalMultipleCards += card.cardCSV.quantity;
          });
          this.loadingCSV = false;
          this.totalCards = this.cardsCSV.length;

          this.messageService.add({
            key: 'tc',
            severity: 'info',
            summary: 'Searching...',
            detail: 'fetching cards in the API'
          });

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
            this.blocked = false;
          }
        });
      });
    }
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
    this.blocked = false;
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
