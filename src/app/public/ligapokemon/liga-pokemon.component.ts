import {Component, OnInit} from '@angular/core';
import {LigaPokemonService} from "../../services/liga-pokemon.service";
import {CSVCard} from "../../models/CSVCard";
import {CollectionsFunctions} from "../../models/collections";
import {IndexesComponent} from "../indexes/indexes.component";
import {DialogService} from "primeng/dynamicdialog";
import {AngularFireAuth} from "@angular/fire/auth";
import {CardCSVDB} from "../../private/import-some/import-some.component";

@Component({
  selector: 'app-ligapokemon',
  templateUrl: './liga-pokemon.component.html',
  styleUrls: ['./liga-pokemon.component.scss']
})

export class LigaPokemonComponent implements OnInit {

  constructor(private service: LigaPokemonService,
              public dialogService: DialogService,
              public auth: AngularFireAuth,) { }

  columns: any[];
  cards: any[] = [];
  quantity: number;
  loading: boolean = true;
  qualityArray: any[];
  rarityArray: any[];
  originalCards: CardCSVDB[];

  ngOnInit(): void {
    this.service.getAll().subscribe(ligaPokemon => {
      this.originalCards = ligaPokemon;
      ligaPokemon.forEach (entry => {
        this.cards.push(this.buildObjectCard(entry));
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

  openDialog() {
    this.dialogService.open(IndexesComponent, {
      header: 'Links to Liga Pokemon',
      width: '70%',
      autoZIndex: false,
      style: {"z-index": 3}
    });
  }

  onRowEditInit(card: CSVCard) {
    console.log(card.key);
  }

  onRowEditSave(editedCard) {
    const filter = this.originalCards.filter(val =>
      val.key == editedCard.key
    );

    const card = filter.pop();

    card.cardCSV.cardNumber = editedCard.cardNumber;
    card.cardCSV.cardName = editedCard.cardName;
    card.cardCSV.edition.name = editedCard.edition.name;
    card.cardCSV.language = editedCard.language;
    card.cardCSV.extras = editedCard.extras.split(', ');

    this.service.update(card.cardCSV, card.key);
  }

  onRowEditCancel(card: CSVCard, index: number) {
   const filter = this.originalCards.filter(val =>
    val.key == card.key
   );
   this.cards.splice(index, 1, this.buildObjectCard(filter.pop()))
  }

  buildObjectCard (card: CardCSVDB) {
    let extrasString: string = '';

    if (card.cardCSV.extras != null) {
      card.cardCSV.extras.forEach(value => {
        extrasString += value + ', ';
      });

      extrasString = extrasString.slice(0, -2);
    }

    return {
      'cardNumber': card.cardCSV.cardNumber,
      'cardName': card.cardCSV.cardName,
      'edition': card.cardCSV.edition,
      'quality': this.getQuality(card.cardCSV.quality),
      'quantity': card.cardCSV.quantity,
      'language': card.cardCSV.language,
      'rarity': this.getRarity(card.cardCSV.rarity),
      'extras': extrasString,
      'dateImport': new Date(card.cardCSV.dateImport),
      'key': card.key
    };
  }
}
