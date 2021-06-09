import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {CardAPI} from "../models/cardAPI";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private db: AngularFireDatabase) { }

  insert(apiRecord: CardAPI) {
    this.db.list('Wishlist').push(apiRecord);
  }

  update(apiRecord: CardAPI, key: string) {
    this.db.list('Wishlist').update(key, apiRecord)
      .catch((error: any) => {
        console.error(error);
      });
  }

  getAll() {
    return this.db.list('Wishlist')
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
    this.db.object(`Wishlist/${key}`).remove();
  }

  async deleteAll() {
    await this.db.object(`Wishlist`).remove();
  }

  searchByChild (child: string, value: string) {
    return this.db.list('Wishlist', ref => ref.orderByChild(child).equalTo(value))
      .snapshotChanges(['child_added'])
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
