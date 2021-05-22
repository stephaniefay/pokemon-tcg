import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {Deck} from "../models/deck";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DecksService {

  constructor(private db: AngularFireDatabase) { }

  insert (deckRecord: Deck) {
    this.db.list('decks').push(deckRecord);
  }

  update(deckRecord: Deck, key: string) {
    this.db.list('decks').update(key, deckRecord)
      .catch((error: any) => {
        console.error(error);
      });
  }

  getAll() {
    return this.db.list('decks')
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => ({
            key: c.payload.key,
            deck: <Deck>c.payload.val()
          }));
        })
      );
  }

  delete(key: string) {
    this.db.object(`decks/${key}`).remove();
  }

}
