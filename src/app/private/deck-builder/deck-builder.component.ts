import { Component, OnInit } from '@angular/core';
import {CardAPIDB} from "../../models/interfaces/cardApiDB";
import {ApiCardService} from "../../services/api-card.service";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {Deck, DeckCard} from "../../models/deck";
import {MessageService} from "primeng/api";
import {CardContent} from "../../models/interfaces/cardContent";
import {CardAPI} from "../../models/cardAPI";
import {DecksService} from "../../services/decks.service";

@Component({
  selector: 'app-deck-builder',
  templateUrl: './deck-builder.component.html',
  styleUrls: ['./deck-builder.component.scss'],
  providers: [MessageService]
})
export class DeckBuilderComponent implements OnInit {

  sourceCards: CardAPIDB[];
  targetCards: CardAPIDB[] = [];

  deckCards: DeckCard[] = [];
  deckQuantity = 0;
  deck: Deck = {cards: [], name: undefined, type: undefined, legality: undefined};

  headers = [
    {label: 'Card #', field: 'number'},
    {label: 'Card Name', field: 'name'},
    {label: 'Type', field: 'type'},
    {label: 'Rarity', field: 'rarity'},
    {label: 'Price (Un)', field: 'price'},
    {label: 'Quantity', field: 'quantity'}
  ];

  types = [ 'Colorless', 'Darkness', 'Dragon', 'Fairy', 'Fighting', 'Fire', 'Grass', 'Lightning', 'Metal', 'Psychic', 'Water'];

  content: CardContent[] = [];

  selectedCard: CardAPIDB;
  dialogCard = false;
  dialogDeck = false;
  quantity: number = 0;

  constructor(private service: ApiCardService,
              private deckService: DecksService,
              public ref: DynamicDialogRef,
              private messageService: MessageService,
              public config: DynamicDialogConfig) { }

  ngOnInit(): void {

    const service = this.service.getAll().subscribe(result => {
      this.sourceCards = result;
      service.unsubscribe();
    });

    setTimeout(() => {
      let doubleRight = document.getElementsByClassName("p-button-icon pi pi-angle-double-right");
      let doubleLeft = document.getElementsByClassName("p-button-icon pi pi-angle-double-left");
      doubleRight.item(0).parentElement.style.display="none"
      doubleLeft.item(0).parentElement.style.display="none"
    }, 100);

  }

  getBadge (rarity:string) {
    if (rarity == null) rarity = 'Common';
    rarity = rarity.replace(/ /g, '').replace(/\./g, '').toLocaleLowerCase();
    return rarity;
  }

  addCard (event) {
    this.selectedCard = event[0];
    this.dialogCard = true;
  }

  saveCard () {
    if (this.quantity == 0) this.quantity = 1;
    const card: DeckCard = {'quantity': this.quantity, 'key': this.selectedCard.key, 'card': this.selectedCard.cardApi};
    this.deckQuantity += this.quantity;
    this.quantity = 0;
    this.deckCards.push(card);
    this.dialogCard = false;
  }

  removeCard(event) {
    const temp = this.deckCards.filter(val =>
      val.key == event[0].key
    );

    this.deckQuantity -= temp[0].quantity;

    this.deckCards = this.deckCards.filter(val =>
      val.key != event[0].key
    );
  }

  saveDeck () {
    if (this.deckQuantity != 60) {
      this.messageService.add({
        severity: 'danger',
        summary: 'Deck not saved',
        detail: 'this deck doesnt have the necessary cards (60)'
      });
      return;
    }

    this.deckCards.forEach( card => {
      let content: CardContent = {};
      let types: string = '';
      if (card.card.subtypes) {
        card.card.subtypes.forEach(value => {
          types += value + ', ';
        });
        types = types.slice(0, -2);
      }

      content.number = card.card.number;
      content.name = card.card.name;
      content.type = types;
      content.rarity = card.card.rarity;
      content.collectionName = card.card.set.name;
      content.collectionId = card.card.set.id;
      content.quantity = card.quantity.toString();
      content.price = this.getPrice(card.card);
      content.image = card.card.images.large;

      this.content.push(content);
    });
    this.content.sort((a,b) => a.name.localeCompare(b.name));

    this.dialogDeck = true;
  }

  validateDeck() {
    this.deck.cards = this.deckCards;
    this.deck.legality = this.getLegality();

    this.deckService.insert(this.deck);
    this.ref.close();
  }

  getLegality() {
    const retorno = [];
    let mapLegality = new Map<string, number>();
    this.deck.cards.forEach(deckCard => {
      if (deckCard.card.legalities.expanded && deckCard.card.legalities.expanded == 'Legal') {
        let expanded = mapLegality.get('expanded');
        if (expanded == undefined)
          expanded = deckCard.quantity;
        else expanded += deckCard.quantity;
        mapLegality.set('expanded', expanded);
      }

      if (deckCard.card.legalities.standard && deckCard.card.legalities.standard == 'Legal') {
        let standard = mapLegality.get('standard');
        if (standard == undefined)
          standard = deckCard.quantity;
        else standard += deckCard.quantity;
        mapLegality.set('standard', standard);
      }

      if (deckCard.card.legalities.unlimited && deckCard.card.legalities.unlimited == 'Legal') {
        let unlimited = mapLegality.get('unlimited');
        if (unlimited == undefined)
          unlimited = deckCard.quantity;
        else unlimited += deckCard.quantity;
        mapLegality.set('unlimited', unlimited);
      }
    });

    if (mapLegality.get('expanded') != undefined && mapLegality.get('expanded') == 60) {
      retorno.push('expanded');
    }

    if (mapLegality.get('standard') != undefined && mapLegality.get('standard') == 60) {
      retorno.push('standard');
    }

    if (mapLegality.get('unlimited') != undefined && mapLegality.get('unlimited') == 60) {
      retorno.push('unlimited');
    }

    return retorno;
  }

  getPrice (card: CardAPI) {
    let flag = false;
    if (card.tcgplayer == null) {
      return '0.00';
    } else if (card.cardCSV.extras && card.cardCSV.extras.length > 0 && card.cardCSV.extras.includes("Edition One")) {
      if (card.cardCSV.extras.includes("Foil")) {
        if (card.tcgplayer.prices['holo1stEditionHolofoilfoil']) {
          return Number(card.tcgplayer.prices['holo1stEditionHolofoilfoil'].market).toFixed(2);
        } else if (card.tcgplayer.prices['1stEditionNormal']) {
          return Number(card.tcgplayer.prices['1stEditionNormal'].market).toFixed(2);
        } else {
          flag = true;
        }
      } else {
        if (card.tcgplayer.prices['1stEditionNormal']) {
          return Number(card.tcgplayer.prices['1stEditionNormal'].market).toFixed(2);
        } else {
          flag = true;
        }
      }
    } else if (card.cardCSV.extras && card.cardCSV.extras.length > 0 && card.cardCSV.extras.includes("Foil") && card.tcgplayer.prices['holofoil']) {
      return Number(card.tcgplayer.prices['holofoil'].market).toFixed(2);
    } else if (card.cardCSV.extras && card.cardCSV.extras.length > 0 && card.cardCSV.extras.includes("Reverse Foil") && card.tcgplayer.prices['reverseHolofoil']) {
      return Number(card.tcgplayer.prices['reverseHolofoil'].market).toFixed(2);
    } else if (card.tcgplayer.prices['normal']) {
      return Number(card.tcgplayer.prices['normal'].market).toFixed(2);
    } else {
      flag = true;
    }

    if (flag) {
      for (let pricesKey in card.tcgplayer.prices) {
        return Number(card.tcgplayer.prices[pricesKey].market).toFixed(2);
      }
    }
  }
}
