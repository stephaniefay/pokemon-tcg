import { Component, OnInit } from '@angular/core';
import {CsvUpdaterService} from "../../services/csv-updater.service";
import {Collections, CollectionsFunctions} from "../../models/collections";
import {AngularFireStorage} from "@angular/fire/storage";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {

  constructor(private service: CsvUpdaterService,
              private storage: AngularFireStorage,
              private http: HttpClient) { }

  buttons: any = [];

  ngOnInit(): void {
    const collectionsFunctions = new CollectionsFunctions();
    this.buttons = collectionsFunctions.getAllKeys();
  }

  getLabel (key) {
    return Collections[key].label;
  }

  async export(key) {

    let url;
    if (key == 'HIDDEN_FATES_SHINY') {
      url = await this.storage.ref('Export/hidden_fates.csv').getDownloadURL().toPromise();
    } else {
      url = await this.storage.ref('Export/' + key.toLowerCase() + '.csv').getDownloadURL().toPromise();
    }

    const object = await this.http.get(url, {responseType: 'text'}).toPromise();

    const data = object.split(/\r\n|\n/);
    const headersRow = this.service.getHeaderArray(data);

    const result = this.service.updateCSV(data, headersRow.length);

    if (result.length < 1) {
      return;
    }

    const separator = ',';
    const keys = Object.keys(result[0]);
    const csvData =
      keys.join(separator) +
      '\n' +
      result.map(row => {
        return keys.map(k => {
          let cell = row[k] === null || row[k] === undefined ? '' : row[k];
          cell = cell instanceof Date
            ? cell.toLocaleString()
            : cell.toString().replace(/"/g, '""');
          if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell}"`;
          }
          return cell;
        }).join(separator);
      }).join('\n');

    const blob = new Blob([csvData], {type: 'text/csv;charset=utf-8;'});
    if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, key + '.csv');
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', key + '.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

}
