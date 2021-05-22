import {Component, OnInit, ViewChild} from '@angular/core';
import {LigaPokemonService} from "../../services/liga-pokemon.service";
import {MessageService} from "primeng/api";
import {CsvReaderService} from "../../services/csv-reader.service";
import {CSVCard} from "../../models/CSVCard";

export interface CardCSVDB {
  key: string;
  cardCSV: CSVCard;
}

@Component({
  selector: 'app-import-some',
  templateUrl: './import-some.component.html',
  styleUrls: ['./import-some.component.css'],
  providers: [MessageService]
})
export class ImportSomeComponent implements OnInit {

  constructor(private ligaPokemonService: LigaPokemonService,
              private messageService: MessageService,
              public csvReader: CsvReaderService) { }

  uploadedFiles: any[] = [];
  cards: CardCSVDB[];


  @ViewChild('uploader') uploader: any;

  ngOnInit(): void {
    const service = this.ligaPokemonService.getAll().subscribe(result => {
      this.cards = result;
      service.unsubscribe();
    });
  }

  uploadFile (event) {
    let file = event.files[0];

    if (this.csvReader.isValidCSVFile(file)) {
      let reader = new FileReader();
      reader.readAsText(file);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        let headersRow = this.csvReader.getHeaderArray(csvRecordsArray);

        this.csvReader.records = this.csvReader.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
        this.csvReader.totalLines = this.csvReader.records.length;
        this.csvReader.records.forEach(record => {
          this.csvReader.linesRead += 1;
          if (record.extras.length == 0) record.extras = null;
          const temp = this.cards.filter(val =>
            val.cardCSV.id == record.id &&
            ((val.cardCSV.extras && record.extras) ? val.cardCSV.extras.sort().join(' ') == record.extras.sort().join(' ') : (val.cardCSV.extras == record.extras)) &&
            val.cardCSV.language == record.language &&
            val.cardCSV.quality == record.quality
          );

          if (temp.length == 0) {
            console.log(record);
            this.ligaPokemonService.insert(record);
          } else if (temp.length == 1) {
            let card = temp.pop();
            card.cardCSV.quantity += record.quantity;
            card.cardCSV.dateImport = record.dateImport;
            this.ligaPokemonService.update(card.cardCSV, card.key);
          } else if (temp.length > 1) {
            console.log('Multiple')
          }
        });
        this.messageService.add({
          severity: 'success',
          summary: 'CSV imported!',
          detail: 'the file was successfully imported to the database!'
        });
        this.fileReset();
      };

      reader.onerror = () => {
        this.messageService.add({severity: 'danger', summary: 'Error', detail: 'error occurred while reading file'});
      };

    } else {
      this.messageService.add({severity: 'warn', summary: 'File not supported', detail: 'Please import valid .csv file'});
      this.fileReset();
    }
  }

  fileReset() {
    this.uploader.clear();
  }

}
