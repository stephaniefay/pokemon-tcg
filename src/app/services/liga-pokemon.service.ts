import { Injectable } from '@angular/core';
import {CSVCard} from "../models/CSVCard";
import {AngularFireDatabase} from "@angular/fire/database";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class LigaPokemonService {

  constructor(private db: AngularFireDatabase) { }

  insert(csvRecord: CSVCard) {
    return this.db.list('LigaPokemon').push(csvRecord);
  }

  update(csvRecord: CSVCard, key: string) {
    this.db.list('LigaPokemon').update(key, csvRecord)
      .catch((error: any) => {
        console.error(error);
      });
  }

  getAll() {
    return this.db.list('LigaPokemon')
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => ({
            key: c.payload.key,
            cardCSV: <CSVCard> c.payload.val()
          }));
        })
      );
  }

  delete(key: string) {
    this.db.object(`LigaPokemon/${key}`).remove();
  }

  async deleteAll() {
    this.db.object(`LigaPokemon`).remove();
  }

  getByTime (time: number) {
    return this.db.list('LigaPokemon', ref => ref.orderByChild('dateImport').startAt(time))
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => ({
            key: c.payload.key,
            cardCSV: <CSVCard> c.payload.val()
          }));
        })
      );
  }

  getByCard (cardName: string) {
    return this.db.list('LigaPokemon', ref => ref.orderByChild('cardName').equalTo(cardName))
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => ({
            key: c.payload.key,
            cardCSV: <CSVCard> c.payload.val()
          }));
        })
      );
  }
}
