import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaisSmall } from '../interfaces/paises.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {
  private _baseUrl: string = 'https://restcountries.com/v3.1'
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']
  
  get regiones(): string[] {
    return [...this._regiones];
  }

  // get url(): string {
  //   return this._baseUrl;
  // }

  constructor(private http: HttpClient) { }

  getPaisesPorRegion(region: string): Observable<PaisSmall[]>{
    const url: string = `${this._baseUrl}/region/${region}?fields=name,cca3`;
    return this.http.get<PaisSmall[]>(url);
  }
}
