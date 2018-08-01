import { Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { HttpClient } from '@angular/common/http'

import { pipe } from 'rxjs'
import { map, filter, debounceTime, retry, switchMap, tap } from 'rxjs/operators'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.styl']
})

export class SearchComponent implements OnInit {

  $results: Object

  timeout: number
  minChars: number
  isLoaded: boolean
  maxAttempts: number
  url: string

  inputSearch = new FormControl('')

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.timeout = 300
    this.minChars = 3
    this.isLoaded = false
    this.maxAttempts = 3
    this.url = 'https://api.github.com/search/repositories?q='

    this.$results = this.inputSearch.valueChanges
      .pipe(
        filter(value => value.length >= this.minChars),
        debounceTime(this.timeout),
        map(repoName => `${this.url}${repoName}`),
        retry(this.maxAttempts),
        switchMap(url => this.http.get(url)),
        map(json => json['items']),
        tap(() => this.isLoaded = true),
      )
      .subscribe(items => this.$results = items)
  }
}
