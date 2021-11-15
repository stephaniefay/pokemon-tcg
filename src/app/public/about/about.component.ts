import { Component, OnInit } from '@angular/core';
import {ConfigurationService} from "../../services/configuration.service";
import {ConfigInterface} from "../../models/interfaces/configInterface";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(private service: ConfigurationService) {}

  name: string;
  twitter: string;
  instagram: string;
  ligaPokemon: string;
  description: string;

  ngOnInit(): void {
    this.service.loadAllConfigurations().subscribe((result: ConfigInterface) => {
      this.name = result.name;
      this.twitter = result.twitter;
      this.instagram = result.instagram;
      this.ligaPokemon = result.ligaPokemon;
      this.description = result.description;
    });
  }

  linkClick(url) {
    window.open(url, '_blank').focus();
  }

}
