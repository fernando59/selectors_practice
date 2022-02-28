import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Country, CountrySmall } from '../interfaces/Countries.interface';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private baseUrl: string = 'https://restcountries.com/v2'
  private _regions: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']

  get regions(): string[] {
    return [...this._regions]
  }

  constructor(private http: HttpClient) { }


  getCountriesByRegion(region: string): Observable<CountrySmall[]> {
    const url = `${this.baseUrl}/region/${region}?fields=alpha3Code,name`
    return this.http.get<CountrySmall[]>(url)

  }
  getCountriesByRegionSmall(region: string): Observable<CountrySmall> {
    const url = `${this.baseUrl}/alpha/${region}?fields=alpha3Code,name`
    return this.http.get<CountrySmall>(url)

  }
  getCountriesByCode(code: string): Observable<Country | null> {
    if (!code) {
      return of(null)
    }
    const url = `${this.baseUrl}/alpha/${code}`
    return this.http.get<Country>(url)

  }

  getCountryByCodes(borders: string[]): Observable<CountrySmall[]> {
    if (!borders) of([])

    const requests: Observable<CountrySmall>[] = []
    console.log(borders)

    borders.forEach(code => {
      const request = this.getCountriesByRegionSmall(code)
      requests.push(request)
    })

    return combineLatest(requests)



  }
}
