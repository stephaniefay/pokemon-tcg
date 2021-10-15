import { Component, OnInit } from '@angular/core';
import {ApiCardService} from "../../services/api-card.service";
import {HttpServiceService} from "../../services/http-service.service";
import {VerifyCollectionInterface} from "../../models/interfaces/verifyCollectionInterface";
import {Collections, CollectionsFunctions} from "../../models/collections";

@Component({
  selector: 'app-verify-collection',
  templateUrl: './verify-collection.component.html',
  styleUrls: ['./verify-collection.component.scss']
})
export class VerifyCollectionComponent implements OnInit {

  constructor(private apiService: ApiCardService,
              private searchService: HttpServiceService) { }

  searchAttr: string;
  searchCollection: string;
  searchResult: VerifyCollectionInterface[];
  collections: any;
  loading = true;

  ngOnInit(): void {
    const collectionsFunctions = new CollectionsFunctions();
    const allKeys = collectionsFunctions.getAllKeys();

    this.collections = [];
    this.collections.push({label: '', code: null});

    allKeys.forEach(key => {
      this.collections.push({ label: Collections[key].label, code: Collections[key].value});
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
    else
      query = 'name:' + this.searchAttr;

    count = 0;
    apiSearchPromise = await this.searchService.searchForCard(query + "&page=" + page).toPromise();
    while (count < apiSearchPromise.totalCount) {
      for (const card of apiSearchPromise.data) {
        this.apiService.searchByChild('id', card.id).subscribe( result => {
          if (result == null || result.length == 0) this.searchResult.push({card: card, owned: false})
          else this.searchResult.push({card: card, owned: true});
        });
      }
      count += apiSearchPromise.count;
      page += 1;
      apiSearchPromise = await this.searchService.searchForCard(query + "&page=" + page).toPromise();
    }
    this.loading = false;
  }

}
