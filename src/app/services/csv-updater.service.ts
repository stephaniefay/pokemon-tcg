import { Injectable } from '@angular/core';
import {LigaPokemonService} from "./liga-pokemon.service";

@Injectable({
  providedIn: 'root'
})
export class CsvUpdaterService {

  constructor(private service: LigaPokemonService) { }


  async updateCSV(csvRecordsArray: any, headerLength: any) {
    const promise = await this.service.getAll().toPromise();

    for (let i = 1; i < csvRecordsArray.length; i++) {

    }

  }


}
