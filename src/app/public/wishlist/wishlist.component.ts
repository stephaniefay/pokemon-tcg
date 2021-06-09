import { Component, OnInit } from '@angular/core';
import {CardAPIDB} from "../../models/interfaces/cardApiDB";
import {ConfirmationService, MessageService} from "primeng/api";
import {AddCardComponent} from "../../private/add-card/add-card.component";
import {DialogService} from "primeng/dynamicdialog";
import {WishlistService} from "../../services/wishlist.service";
import {AngularFireAuth} from "@angular/fire/auth";
import {AddWishlistComponent} from "../../private/add-wishlist/add-wishlist.component";
import {CollectionsFunctions} from "../../models/collections";

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class WishlistComponent implements OnInit {

  cards: CardAPIDB[];
  card: CardAPIDB;


  constructor(private confirmationService: ConfirmationService,
              public auth: AngularFireAuth,
              private service: WishlistService,
              private messageService: MessageService,
              public dialogService: DialogService) { }

  ngOnInit(): void {
    this.service.getAll().subscribe(result => {
      this.cards = result;
      this.cards.sort((a, b) => a.cardApi.name.localeCompare(b.cardApi.name));
    });
  }

  deleteCard(card: CardAPIDB) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + card.cardApi.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.delete(card.key);
        this.cards = this.cards.filter(val => val.key !== card.key);
        this.card = null;
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Card Deleted', life: 3000});
      }
    });
  }

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  openNew() {
    this.dialogService.open(AddWishlistComponent, {
      header: 'Add cards',
      width: '90%',
      autoZIndex: false,
      style: {"z-index": 3}
    });
  }

  getPrice(card) {
    if (card.cardApi.tcgplayer && card.cardApi.tcgplayer.prices) {
      for (let pricesKey in card.cardApi.tcgplayer.prices) {
        return Number(card.cardApi.tcgplayer.prices[pricesKey].market);
      }
    } else {
      return 0;
    }
  }

  getIcon (code: string) {
    if (code == '' || code == null) {
      return 'base1.png'
    }
    return code + '.png';
  }

  getBadge (rarity:string) {
    if (rarity == null) rarity = 'Common';
    rarity = rarity.replace(/ /g, '').replace(/\./g, '').toLocaleLowerCase();
    return rarity;
  }

}
