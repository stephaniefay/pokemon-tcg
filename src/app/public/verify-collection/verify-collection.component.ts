import { Component, OnInit } from '@angular/core';
import {ApiCardService} from "../../services/api-card.service";
import {HttpServiceService} from "../../services/http-service.service";
import {VerifyCollectionInterface} from "../../models/interfaces/verifyCollectionInterface";

@Component({
  selector: 'app-verify-collection',
  templateUrl: './verify-collection.component.html',
  styleUrls: ['./verify-collection.component.scss']
})
export class VerifyCollectionComponent implements OnInit {

  constructor(private apiService: ApiCardService,
              private searchService: HttpServiceService) { }

  searchAttr: string;
  searchResult: VerifyCollectionInterface[];
  loading = true;

  ngOnInit(): void {}

  async search() {
    this.searchResult = [];

    //FIXME: when the result set is bigger than 250, the remaining cards are ignored.
    var apiSearchPromise = await this.searchService.searchForCard('name:'+this.searchAttr).toPromise();
    for (const card of apiSearchPromise.data) {
      this.apiService.searchByChild('id', card.id).subscribe( result => {
        if (result == null || result.length == 0) this.searchResult.push({card: card, owned: false})
        else this.searchResult.push({card: card, owned: true});
      })
    }

    this.loading = false;
  }

}
