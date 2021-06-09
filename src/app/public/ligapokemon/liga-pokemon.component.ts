import {Component, OnInit} from '@angular/core';
import {LigaPokemonService} from "../../services/liga-pokemon.service";
import {CSVCard} from "../../models/CSVCard";
import {CollectionsFunctions} from "../../models/collections";

@Component({
  selector: 'app-ligapokemon',
  templateUrl: './liga-pokemon.component.html',
  styleUrls: ['./liga-pokemon.component.scss']
})

export class LigaPokemonComponent implements OnInit {

  constructor(private service: LigaPokemonService) { }

  columns: any[];
  cards: any[] = [];
  quantity: number;
  loading: boolean = true;
  qualityArray: any[];
  rarityArray: any[];

  ngOnInit(): void {
    this.service.getAll().subscribe(ligaPokemon => {
      ligaPokemon.forEach (entry => {
        const cardCSV = <CSVCard>entry.cardCSV;

        let extrasString: string = '';

        if (cardCSV.extras != null) {
          cardCSV.extras.forEach(value => {
            extrasString += value + ', ';
          });

          extrasString = extrasString.slice(0, -2);
        }

        this.cards.push(
          {
            'cardNumber': cardCSV.cardNumber,
            'cardName': cardCSV.cardName,
            'edition': cardCSV.edition,
            'quality': this.getQuality(cardCSV.quality),
            'quantity': cardCSV.quantity,
            'language': cardCSV.language,
            'rarity': this.getRarity(cardCSV.rarity),
            'extras': extrasString,
            'dateImport': new Date(cardCSV.dateImport)
          }
        )
      });
      this.quantity = ligaPokemon.length;
      this.loading = false;
    });

    this.columns = [
      { field: 'cardNumber', header: 'Card #' },
      { field: 'cardName', header: 'Card Name' },
      { field: 'edition', header: 'Collection' },
      { field: 'quality', header: 'Quality' },
      { field: 'quantity', header: 'Quantity' },
      { field: 'language', header: 'Language' },
      { field: 'rarity', header: 'Rarity' },
      { field: 'extras', header: 'Extras' }
    ];

    this.initializeFilters();
  }

  initializeFilters () {
    this.qualityArray = ['Mint (M)', 'Near Mint (NM)', 'Slightly Played (SP)', 'Moderately Played (MP)',
      'Heavily Played (HP)', 'Damaged (D)'];

    this.rarityArray = ['Common', 'Uncommon', 'Rare', 'Rare Holo', 'Rare Holo EX', 'Rare Holo Lv.X', 'Rare Ultra',
      'Rare Prime', 'Rare ACE', 'Legend', 'Secret Rare / Promo', 'Amazing Rare', 'Hyper Rare', 'Shiny Rare'];
  }

  getRarity (initial: string) {
    if (initial == null || initial.trim() == '') return '';
    switch (initial) {
      case 'C':
        return 'Common';
      case 'U':
        return 'Uncommon';
      case 'R':
        return 'Rare';
      case 'RH':
        return 'Rare Holo';
      case 'RE':
        return 'Rare Holo EX';
      case 'RL':
        return 'Rare Holo Lv.X';
      case 'RU':
        return 'Rare Ultra';
      case 'RP':
        return 'Rare Prime';
      case 'RA':
        return 'Rare ACE';
      case 'L':
        return 'Legend';
      case 'S':
        return 'Secret Rare / Promo';
      case 'AR':
        return 'Amazing Rare';
      case 'HR':
        return 'Hyper Rare';
      case 'SR':
        return 'Shiny Rare';
    }
  }

  getQuality (initial: string) {
    if (initial.trim() == '') return '';
    switch (initial) {
      case 'M':
        return 'Mint (M)';
      case 'NM':
        return 'Near Mint (NM)';
      case 'SP':
        return 'Slightly Played (SP)'
      case 'MP':
        return 'Moderately Played (MP)';
      case 'HP':
        return 'Heavily Played (HP)';
      case 'D':
        return 'Damaged (D)';
    }
  }

  getIcon (code: string) {
    const service = new CollectionsFunctions();
    if (code == '' || code == null) {
      return 'base1.png'
    }
    return code + '.png';
  }
}
