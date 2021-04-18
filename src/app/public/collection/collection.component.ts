import { Component, OnInit } from '@angular/core';
import {Collections} from "../../models/collections";
import {HttpServiceService} from "../../services/http-service.service";
import {CollectionService} from "../../services/collection.service";
import {CardAPI} from "../../models/cardAPI";

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {

  constructor(private service: HttpServiceService,
              private dbService: CollectionService) { }

  collectionsKeys: any[] = [];
  text: CardAPI;

  ngOnInit(): void {
    Object.keys(Collections).map(key => {
      this.collectionsKeys.push(key);
    });

    this.service.getCard('xy7-54').subscribe( response => {
      this.text = <CardAPI>response;
      console.log(this.text);
    });

  }

  getIcon (collection: string) {
    this.collectionsKeys.forEach(key => {
      if (Collections[key].label == collection) {
        return Collections[key].value;
      }
    });
  }

  fetchCard (key: string) {

  }

}
