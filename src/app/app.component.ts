import { Component } from '@angular/core';
import {PrimeNGConfig} from "primeng/api";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pokemon-tcg';
  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  constructor(private primengConfig: PrimeNGConfig) {}
}
