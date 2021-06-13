import {Collections, CollectionsFunctions} from "./collections";

export const Categories = {
  BASE_COLLECTION: {id: 'base', label: 'Base Collection'},
  GYM_COLLECTION: {id: 'gym', label: 'Gym Collection'},
  NEO_COLLECTION: {id: 'neo', label: 'Neo Collection'},
  ECARD_COLLECTION: {id: 'ecard', label: 'E-Card Collection'},
  NP_COLLECTION: {id: 'np', label: 'NP Collection'},
  EX_COLLECTION: {id: 'ex', label: 'EX Collection'},
  DP_COLLECTION: {id: 'dp', label: 'Diamond & Pearl Collection'},
  POP_COLLECTION: {id: 'pop', label: 'POP Collection'},
  PLAT_COLLECTION: {id: 'pl', label: 'Platinum Collection'},
  HGSS_COLLECTION: {id: 'hs, hgss, col', label: 'HeartGold & SoulSilver Collection'},
  BW_COLLECTION: {id: 'bw, dv', label: 'Black & White Collection'},
  XY_COLLECTION: {id: 'xy, dc, g1', label: 'XY Collection'},
  OTHERS_COLLECTION: {id: 'si, ru, mcd', label: 'Other Collections'},
  SM_COLLECTION: {id: 'sm, det', label: 'Sun & Moon Collection'},
  SWSH_COLLECTION: {id: 'swsh', label: 'Sword & Shield Collection'}
} as const;

export class CategoriesFunctions {
  getAllKeys() {
    const keys = [];
    Object.keys(Categories).map(key => {
      keys.push(key);
    });
    return keys;
  }

  getCollectionsByCategory (ids: string) {
    const collections = [];
    const id_split = ids.split(', ');
    new CollectionsFunctions().getAllKeys().forEach(key => {
      const value: string = Collections[key].value;
      id_split.forEach(id => {
        if(value.includes(id)) {
          collections.push(Collections[key]);
        }
      });
    });
    return collections;
  }

  getKeyById (id: string) {
    const allKeys = this.getAllKeys();
    for (let i = 0; i < allKeys.length; i++) {
      if (Categories[allKeys[i]].id == id)
        return allKeys[i];
    }
  }
}
