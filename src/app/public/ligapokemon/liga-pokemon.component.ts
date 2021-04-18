import { Component, OnInit } from '@angular/core';
import {LigaPokemonService} from "../../services/liga-pokemon.service";
import {CSVCard} from "../../models/CSVCard";

@Component({
  selector: 'app-ligapokemon',
  templateUrl: './liga-pokemon.component.html',
  styleUrls: ['./liga-pokemon.component.css']
})

export class LigaPokemonComponent implements OnInit {

  constructor(private service: LigaPokemonService) { }

  columns: any[];
  cards: any[] = [];

  ngOnInit(): void {
    this.service.getAll().subscribe(ligaPokemon => {
      ligaPokemon.forEach (entry => {
        const cardCSV = <CSVCard>entry.cardCSV;

        this.cards.push(
          {
            'cardNumber': cardCSV.cardNumber,
            'cardName': cardCSV.cardName,
            'edition': cardCSV.edition,
            'quality': this.getQuality(cardCSV.quality),
            'quantity': cardCSV.quantity,
            'language': cardCSV.language,
            'rarity': this.getRarity(cardCSV.rarity),
            'extras': cardCSV.extras
          }
        )
      });
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
  }

  getRarity (initial: string) {
    if (initial.trim() == '') return '';
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


}
