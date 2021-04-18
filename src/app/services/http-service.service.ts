import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  httpHeaders = new HttpHeaders({'x-api-key': environment.api_key});
  constructor(private http: HttpClient) { }

  getCard (id: string) {
    return this.http.get('https://api.pokemontcg.io/v2/cards/'+ id, {headers: this.httpHeaders});
  }
}
