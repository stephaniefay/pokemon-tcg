import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {map} from "rxjs/operators";
import {CardAPI} from "../models/cardAPI";

@Injectable({
  providedIn: 'root'
})
export class ApiCardService {

  constructor(private db: AngularFireDatabase) { }

  insert(apiRecord: CardAPI) {
    this.db.list('API').push(apiRecord);
  }

  update(apiRecord: CardAPI, key: string) {
    this.db.list('API').update(key, apiRecord)
      .catch((error: any) => {
        console.error(error);
      });
  }

  getAll() {
    return this.db.list('API')
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => ({
            key: c.payload.key,
            cardApi: <CardAPI>c.payload.val()
          }));
        })
      );
  }

  delete(key: string) {
    this.db.object(`API/${key}`).remove();
  }

  async deleteAll() {
    await this.db.object(`API`).remove();
  }

  searchByChild (child: string, value: string) {
    return this.db.list('API', ref => ref.orderByChild(child).equalTo(value))
      .snapshotChanges()
      .pipe(
        map( changes => {
          return changes.map((c => ({
            key: c.payload.key,
            cardApi: <CardAPI>c.payload.val()
          })))
        })
      );
  }

}
