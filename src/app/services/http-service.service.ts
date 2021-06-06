import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {CardAPI} from "../models/cardAPI";
import {ApiSearch} from "../models/interfaces/apiSearch";

export interface SearchCardAPI {
  data: CardAPI;
}

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  httpHeaders = new HttpHeaders({'x-api-key': environment.api_key});
  constructor(private http: HttpClient) { }

  getCard (id: string) {
    return this.http.get<SearchCardAPI>('https://api.pokemontcg.io/v2/cards/'+ id, {headers: this.httpHeaders});
  }

  searchForCard (query: string) {
    return this.http.get<ApiSearch>('https://api.pokemontcg.io/v2/cards?q=' + query, {headers: this.httpHeaders});
  }
}
