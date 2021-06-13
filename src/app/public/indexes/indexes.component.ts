import { Component, OnInit } from '@angular/core';
import {Categories, CategoriesFunctions} from "../../models/categories";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
  selector: 'app-indexes',
  templateUrl: './indexes.component.html',
  styleUrls: ['./indexes.component.scss']
})
export class IndexesComponent implements OnInit {

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  categories = [];
  collections = new Map();

  ngOnInit(): void {
    const categoriesFunctions = new CategoriesFunctions();
    categoriesFunctions.getAllKeys().forEach(key => {
      this.categories.push(Categories[key]);
      this.collections.set(key, categoriesFunctions.getCollectionsByCategory(Categories[key].id));
    });
  }

  isLinkDisabled (category, collection: number) {
    const categoryMap = this.collections.get(new CategoriesFunctions().getKeyById(category.id));
    return categoryMap[collection].url == '';
  }

  getArrayOfCollections(category) {
    const keyById = new CategoriesFunctions().getKeyById(category.id);
    return this.collections.get(keyById);
  }

  getLabel(value) {
    return value.label;
  }

}
