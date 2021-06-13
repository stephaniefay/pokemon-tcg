import { Injectable } from '@angular/core';
import {LigaPokemonService} from "./liga-pokemon.service";
import {CsvInterface} from "../models/interfaces/csvInterface";

@Injectable({
  providedIn: 'root'
})
export class CsvUpdaterService {

  CSVList: any;

  constructor(private service: LigaPokemonService) {
    this.service.getAll().subscribe( result => {
      this.CSVList = result;
    });
  }

  exportArray: CsvInterface[] = [];

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }



  updateCSV(csvRecordsArray: any, headerLength: any) {
    this.exportArray = [];
    let re = /"/gi;

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let currentRecord = (<string>csvRecordsArray[i]).split('","');
      if (currentRecord.length == headerLength) {
        const cardName = currentRecord[4].trim().replace(re, '');
        const cardNumber = currentRecord[11].trim().replace(re, '');
        const collection = currentRecord[1].trim().replace("&rsquo;", "'").replace(re, '');
        const filtered = this.CSVList.filter(val =>
          val.cardCSV.cardName.replace("Poké", "Poke") == cardName &&
          val.cardCSV.cardNumber == cardNumber &&
          val.cardCSV.edition.name == collection
        );

        filtered.forEach(card => {
          currentRecord[5] = '"' + card.cardCSV.quantity + '"';
          currentRecord[6] = '"' + card.cardCSV.quality + '"';
          if (card.cardCSV.language == 'BR') {
            currentRecord[7] = '"PT"';
          } else {
            currentRecord[7] = '"' +  card.cardCSV.language + '"';
          }
          if (card.cardCSV.extras == undefined) {
            currentRecord[10] = "";
          } else if (card.cardCSV.extras) {
            currentRecord[10] = '"' + card.cardCSV.extras.join(', ') + '"';
          }
          this.exportArray.push(this.buildObject(currentRecord));
        });
      }
    }

    return this.exportArray;
  }

  buildObject (record: any[]) {
    const retorno = {
      'Edicao (PTBR)': record[0],
      'Edicao (EN)': record[1],
      'Edicao (Sigla)': record[2],
      'Card (PT)': record[3],
      'Card (EN)': record[4],
      'Quantidade': record[5],
      'Qualidade (M NM SP MP HP D)': record[6],
      'Idioma (BR EN DE ES FR IT JP KO RU TW)': record[7],
      'Raridade (C I U R H E X U P A L S)': record[8],
      'Cor (C D O E Y F R G L M P W)': record[9],
      'Extras': record[10],
      'Card #': record[11],
      'Comentario': record[12],
      '# Cards na Edicao': record[13],
    }
    return retorno;
  }

}
