import {Component, OnInit, ViewChild} from '@angular/core';
import {MessageService} from "primeng/api";
import {LigaPokemonService} from "../../services/liga-pokemon.service";
import {CsvReaderService} from "../../services/csv-reader.service";

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css'],
  providers: [MessageService]
})

export class ImportComponent implements OnInit {

  constructor(private ligaPokemonService: LigaPokemonService,
              private messageService: MessageService,
              public csvReader: CsvReaderService) { }
  uploadedFiles: any[] = [];

  @ViewChild('uploader') uploader: any;

  ngOnInit(): void {
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
        this.ligaPokemonService.deleteAll().then(() => {
          this.csvReader.records.forEach(record => {
            this.csvReader.linesRead += 1;
            this.ligaPokemonService.insert(record);
          });
          this.messageService.add({
            severity: 'success',
            summary: 'CSV imported!',
            detail: 'the file was successfully imported to the database!'
          });
          this.fileReset();
        });
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
