import {Component, OnInit, ViewChild} from '@angular/core';
import {MessageService} from "primeng/api";
import {CSVCard} from "../../models/CSVCard";
import {LigaPokemonService} from "../../services/liga-pokemon.service";

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css'],
  providers: [MessageService]
})

export class ImportComponent implements OnInit {

  constructor(private csvService: LigaPokemonService,
              private messageService: MessageService) { }
  uploadedFiles: any[] = [];
  records: any[] = [];

  @ViewChild('csvReader') csvReader: any;

  ngOnInit(): void {
  }

  uploadFile (event) {
    let file = event.files[0];

    if (this.isValidCSVFile(file)) {
      let reader = new FileReader();
      reader.readAsText(file);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        let headersRow = this.getHeaderArray(csvRecordsArray);

        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
        this.csvService.deleteAll().then(() => {
          this.records.forEach(record => {
            this.csvService.insert(record);
          });
          this.messageService.add({
            severity: 'success',
            summary: 'CSV imported!',
            detail: 'the file was successfully imported to the database!'
          });
          this.fileReset();
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

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let currentRecord = (<string>csvRecordsArray[i]).split('","');
      let re = /"/gi;
      if (currentRecord.length == headerLength) {
        let csvRecord: CSVCard = new CSVCard();
        csvRecord.edition_ptbr = currentRecord[0].trim().replace(re, '');
        csvRecord.edition = currentRecord[1].trim().replace("&rsquo;", "'").replace(re, '');
        csvRecord.initials = currentRecord[2].trim().replace(re, '');
        csvRecord.cardName_ptbr = currentRecord[3].trim().replace(re, '');
        csvRecord.cardName = currentRecord[4].trim().replace(re, '');
        csvRecord.quantity = Number(currentRecord[5].trim().replace(re, ''));
        csvRecord.quality = currentRecord[6].trim().replace(re, '');
        csvRecord.language = currentRecord[7].trim().replace(re, '');
        csvRecord.rarity = currentRecord[8].trim().replace(re, '');
        csvRecord.color = currentRecord[9].trim().replace(re, '');
        csvRecord.extras = [];
        currentRecord[10].split(',').forEach(value => {
          const valueTreated = value.trim().replace(re, '');
          if (valueTreated != '')
            csvRecord.extras.push(valueTreated);
        });
        csvRecord.cardNumber = currentRecord[11].trim().replace(re, '');
        csvRecord.comments = currentRecord[12].trim().replace(re, '');
        csvRecord.cardsInEdition = currentRecord[13].trim().replace(re, '');

        csvArr.push(csvRecord);
      }
    }
    return csvArr;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    this.csvReader.clear();
  }

}
