import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {AngularFireStorage} from "@angular/fire/storage";
import {ConfigInterface} from "../models/interfaces/configInterface";

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(private db: AngularFireDatabase,
              private storage: AngularFireStorage) { }

  loadAllConfigurations() {
    return this.db.object('Configuration').valueChanges();
  }

  loadTheme () {
    return this.db.object('Configuration/theme').valueChanges();
  }

  switchTheme(theme: string) {
    const itemRef = this.db.object('Configuration/theme');
    itemRef.set(theme);
  }

  loadLogo () {
    return this.db.object('Configuration/logoPath').valueChanges();
  }

  switchLogo(file: File) {
    const service = this.loadLogo().subscribe(oldPath => {
      service.unsubscribe();
      this.storage.ref(<string>oldPath).delete();
      this.storage.upload(file.name, file).then(result => {
        var itemRef = this.db.object('Configuration/logoPath');
        itemRef.set(file.name);
      });
    });
  }

  loadWishHeart () {
    return this.db.object('Configuration/wishHeart').valueChanges();
  }

  switchWishHeart(heart: string) {
    const itemRef = this.db.object('Configuration/wishHeart');
    itemRef.set(heart);
  }

  loadFilter() {
    return this.db.object('Configuration/filter').valueChanges();
  }

  switchFilter(filter: string) {
    const itemRef = this.db.object('Configuration/filter');
    itemRef.set(filter);
  }

  loadBehaviour() {
    return this.db.object('Configuration/behaviour').valueChanges();
  }

  switchBehaviour(behaviour: string) {
    const itemRef = this.db.object('Configuration/behaviour');
    itemRef.set(behaviour);
  }

  saveData (data: ConfigInterface) {
    let itemRef;
    itemRef = this.db.object('Configuration/name');
    itemRef.set(data.name);

    itemRef = this.db.object('Configuration/twitter');
    itemRef.set(data.twitter);

    itemRef = this.db.object('Configuration/instagram');
    itemRef.set(data.instagram);

    itemRef = this.db.object('Configuration/ligaPokemon');
    itemRef.set(data.ligaPokemon);

    itemRef = this.db.object('Configuration/description');
    itemRef.set(data.description);

  }
}
