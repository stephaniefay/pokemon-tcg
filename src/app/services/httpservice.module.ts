import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class HttpserviceModule {

  constructor(private http: HttpClient) {}

}
