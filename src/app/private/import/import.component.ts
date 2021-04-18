import {Component, OnInit, ViewChild} from '@angular/core';
import {Message, MessageService} from "primeng/api";
import {CSVCard} from "../../models/CSVCard";

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css'],
  providers: [MessageService]
})

export class ImportComponent implements OnInit {

  constructor() { }
  uploadedFiles: any[] = [];
  records: any[] = [];
  msgs: Message[] = [];

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
      };

      reader.onerror = () => {
        this.msgs.push({severity:'danger', summary:'Error', detail:'error occured while reading file'});
      };

    } else {
      this.msgs.push({severity: 'warn', summary: 'File not supported', detail: 'Please import valid .csv file'});
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let currentRecord = (<string>csvRecordsArray[i]).split(',');
      let re = /\"/gi;
      if (currentRecord.length == headerLength) {
        let csvRecord: CSVCard = new CSVCard();
        csvRecord.edition = currentRecord[1].trim().replace(re, '');
        csvRecord.initials = currentRecord[2].trim().replace(re, '');
        csvRecord.cardName = currentRecord[4].trim().replace(re, '');
        csvRecord.cardNumber = currentRecord[11].trim().replace(re, '');
        csvRecord.quantity = Number(currentRecord[5].trim().replace(re, ''));
        csvRecord.quality = currentRecord[6].trim().replace(re, '');
        csvRecord.idiom = currentRecord[7].trim().replace(re, '');
        csvRecord.rarity = currentRecord[8].trim().replace(re, '');
        csvRecord.color = currentRecord[9].trim().replace(re, '');
        csvRecord.extras = [];
        currentRecord[10].split(',').forEach(value => {
          const valueTreated = value.trim().replace(re, '');
          if (valueTreated != '')
            csvRecord.extras.push(valueTreated);
        });

        csvArr.push(csvRecord);
        console.log(csvRecord);
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
