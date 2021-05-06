import { Injectable } from '@angular/core';
import {CSVCard} from "../models/CSVCard";
import {CollectionsFunctions} from "../models/collections";

@Injectable({
  providedIn: 'root'
})
export class CsvReaderService {

  records: CSVCard[] = [];
  linesRead: number = 0;
  totalLines: number;
  currentDate: Date = new Date();

  constructor() { }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];
    const service = new CollectionsFunctions();

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let currentRecord = (<string>csvRecordsArray[i]).split('","');
      let re = /"/gi;
      if (currentRecord.length == headerLength) {
        let csvRecord: CSVCard = new CSVCard();
        csvRecord.edition_ptbr = currentRecord[0].trim().replace(re, '');
        var editionName = currentRecord[1].trim().replace("&rsquo;", "'").replace(re, '');
        var iconPath = service.getIdentifierByCollectionName(editionName);
        csvRecord.edition = {name: editionName, image: (iconPath != null) ? iconPath : null};
        csvRecord.initials = currentRecord[2].trim().replace(re, '');
        csvRecord.cardName_ptbr = currentRecord[3].trim().replace(re, '');
        csvRecord.cardName = currentRecord[4].trim().replace(re, '');
        if (csvRecord.cardName.includes('Poke')) {
          csvRecord.cardName = csvRecord.cardName.replace('Poke', 'Poké').trim();
        }

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
        csvRecord.dateImport = this.currentDate.getTime();

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
}
