import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountrySmall } from '../../interfaces/Countries.interface';
import { CountriesService } from '../../services/countries.service';
import { switchMap, tap } from 'rxjs/operators'
import { of } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {

  regions: string[] = []
  countries: CountrySmall[] = []
  frontiers: CountrySmall[] = []
  loading: boolean = false


  myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    frontier: ['', Validators.required],


  })


  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService
  ) { }

  ngOnInit(): void {
    this.regions = this.countriesService.regions

    this.myForm.get('region')?.valueChanges
      .pipe(
        tap(_ => {
          this.myForm.get('country')?.reset('')
          this.loading = true

        }),
        switchMap(region => this.countriesService.getCountriesByRegion(region)))
      .subscribe(countries => {
        this.countries = countries
        this.loading = false
      })


    this.myForm.get('country')?.valueChanges
      .pipe(
        tap(_ => {
          this.myForm.get('frontier')?.reset('')

          this.loading = true

        }),
        switchMap(code => this.countriesService.getCountriesByCode(code)),
        switchMap(country => {
          console.log(country)
          if(!country?.borders) return of([]);
          return this.countriesService.getCountryByCodes(country?.borders! || [])
        }),
        tap(countries =>this.frontiers=countries)
        )
      .subscribe(_ => {
        this.loading = false
      })


  }





}
