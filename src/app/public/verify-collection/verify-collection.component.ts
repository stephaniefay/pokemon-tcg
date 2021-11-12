import { Component, OnInit } from '@angular/core';
import {ApiCardService} from "../../services/api-card.service";
import {HttpServiceService} from "../../services/http-service.service";
import {VerifyCollectionInterface} from "../../models/interfaces/verifyCollectionInterface";
import {Collections, CollectionsFunctions} from "../../models/collections";
import {ConfirmationService, MessageService} from "primeng/api";
import {WishlistService} from "../../services/wishlist.service";
import {AngularFireAuth} from "@angular/fire/auth";

@Component({
  selector: 'app-verify-collection',
  templateUrl: './verify-collection.component.html',
  styleUrls: ['./verify-collection.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class VerifyCollectionComponent implements OnInit {

  constructor(private apiService: ApiCardService,
              public auth: AngularFireAuth,
              private confirmationService: ConfirmationService,
              private searchService: HttpServiceService,
              private messageService: MessageService,
              public wishlist: WishlistService) {
  }

  searchAttr: string;
  searchCollection: string;
  searchResult: VerifyCollectionInterface[];
  collections: any;
  loading = true;
  user: any;

  ngOnInit(): void {
    const collectionsFunctions = new CollectionsFunctions();
    const allKeys = collectionsFunctions.getAllKeys();

    this.collections = [];
    this.collections.push({label: '', code: null});

    allKeys.forEach(key => {
      this.collections.push({label: Collections[key].label, code: Collections[key].value});
    });

    this.auth.user.subscribe(user => {
      this.user = user;
    });
  }

  async search() {
    if ((this.searchCollection == null || this.searchCollection['code'] == null) && (this.searchAttr == null || this.searchAttr.trim() == '')) return;

    let apiSearchPromise;
    let count;
    this.searchResult = [];
    let page = 1;
    let query = '';

    this.loading = true;

    if (this.searchCollection != null && this.searchCollection['code'] != null)
      query = 'set.id:' + this.searchCollection['code'];
    else if (this.searchAttr.includes(' '))
      query = 'name:"' + this.searchAttr + '"';
    else
      query = 'name:' + this.searchAttr;

    count = 0;
    apiSearchPromise = await this.searchService.searchForCard(query + "&page=" + page).toPromise();
    while (count < apiSearchPromise.totalCount) {
      for (const card of apiSearchPromise.data) {
        this.apiService.searchByChild('id', card.id).subscribe(result => {
          if (result == null || result.length == 0) {
            this.wishlist.searchByChild('id', card.id).subscribe(wishlist => {
              if (wishlist == null || wishlist.length == 0) {
                this.searchResult.push({card: card, id: card.id, owned: false, wish: false})
              } else {
                this.searchResult.push({card: card, id: card.id, owned: false, wish: true})
              }
            });
          } else {
            this.wishlist.searchByChild('id', card.id).subscribe(wishlist => {
              if (wishlist == null || wishlist.length == 0) {
                this.searchResult.push({card: card, id: card.id, owned: true, wish: false})
              } else {
                this.searchResult.push({card: card, id: card.id, owned: true, wish: true})
              }
            });
          }
        });
      }
      count += apiSearchPromise.count;
      page += 1;
      apiSearchPromise = await this.searchService.searchForCard(query + "&page=" + page).toPromise();
    }

    const tempArray = [];
    this.searchResult.forEach(card => {
      this.wishlist.searchByChild('id', card.card.id).subscribe(result => {
        if (result == null || result.length == 0) tempArray.push(card);
        else tempArray.push({card: card.card, owned: card.owned, wish: true});

        this.searchResult = tempArray;
      });
    });

    this.loading = false;
  }

  addToWishlist(card: VerifyCollectionInterface) {
    if (!card.wish && !card.owned && this.user) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to put ' + card.card.name + ' on your wishlist?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-circle',
        accept: () => {
          card.wish = true;
          this.wishlist.insert(card.card)
          this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Card Inserted', life: 100});
        }
      });
    }
  }
}
