import {Component, OnInit, ViewChild} from '@angular/core';
import {ConfigurationService} from "../../services/configuration.service";
import {MessageService} from "primeng/api";
import {ConfigInterface} from "../../models/interfaces/configInterface";
import {configurations} from "../../models/interfaces/configurations";

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss'],
  providers: [MessageService]
})
export class ConfigurationsComponent implements OnInit {

  constructor(private messageService: MessageService,
              private configService: ConfigurationService) { }

  fileName: string;
  filters: any;
  behaviours: any;
  filterSelected: configurations;
  behaviourSelected: configurations;
  name: string = '';
  twitter: string = '';
  instagram: string = '';
  ligaPokemon: string = '';
  description: string = '';

  @ViewChild('uploader') uploader: any;

  ngOnInit(): void {
    this.filters = [
      {name: 'Dex Number', value: 'cardApi.dexNum'},
      {name: 'Acquisition Date (Desc)', value: '!cardApi.cardCSV.dateImport'},
      {name: 'Acquisition Date (Asc)', value: 'cardApi.cardCSV.dateImport'},
      {name: 'Alphabetically', value: 'cardApi.name'},
      {name: 'Price High to Low', value: '!cardApi.priceTotal'},
      {name: 'Price Low to High', value: 'cardApi.priceTotal'}
    ];
    this.behaviours = [
      {name: 'Total Price & Quantity', value: 'totalPriceAndQuantity'},
      {name: 'Price of an Item & Quantity', value: 'itemPriceAndQuantity'},
      {name: 'Total Price', value: 'totalPrice'},
      {name: 'Price of an Item', value: 'itemPrice'},
      {name: 'Quantity', value: 'quantity'}
    ];

    const serviceConfigurations = this.configService.loadAllConfigurations().subscribe((result: ConfigInterface) => {
      serviceConfigurations.unsubscribe();
      this.filterSelected = result.filter;
      this.behaviourSelected = result.behaviour;
      this.name = result.name;
      this.instagram = result.instagram;
      this.twitter = result.twitter;
      this.ligaPokemon = result.ligaPokemon;
      this.description = result.description;
    });
  }

  changeTheme(theme: string) {
    this.configService.switchTheme(theme);
    this.messageService.clear();
    this.messageService.add({severity: 'success', summary: 'Theme changed!', detail: '', life: 100});
  }

  changeLogo(event: any) {
    this.configService.switchLogo(event.files[0]);
    this.uploader.clear();
    this.fileName = null;
    this.messageService.clear();
    this.messageService.add({severity: 'success', summary: 'Logo changed!', detail: '', life: 100});
  }

  showLogoFile(event: any) {
    this.fileName = event.currentFiles[0].name
  }

  changeWishHeart(heart: string) {
    this.configService.switchWishHeart(heart);
    this.messageService.clear();
    this.messageService.add({severity: 'success', summary: 'Heart changed!', detail: '', life: 100});
  }

  changeFilter (event) {
    this.configService.switchFilter(event.value);
    this.messageService.clear();
    this.messageService.add({severity: 'success', summary: 'Filters changed!', detail: '', life: 100});
  }

  changeBehaviour (event) {
    this.configService.switchBehaviour(event.value);
    this.messageService.clear();
    this.messageService.add({severity: 'success', summary: 'Behaviour changed!', detail: '', life: 100});

  }

  save() {
    const config: ConfigInterface = {
      name: this.name,
      twitter: this.twitter,
      instagram: this.instagram,
      ligaPokemon: this.ligaPokemon,
      description: this.description
    }

    this.configService.saveData(config);
    this.messageService.clear();
    this.messageService.add({severity: 'success', summary: 'Info saved!', detail: '', life: 100});
  }
}
