import { Component } from '@angular/core'
import { FormControl } from '@angular/forms'
import { HttpClient } from '@angular/common/http'

import { pipe, of, merge, from } from 'rxjs'
import { map, filter, debounceTime, retry, switchMap, tap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})

export class AppComponent {
  title = 'Github Search'

  timeout = 300
  minChars = 3
  isLoaded = false
  maxAttempts = 3
  
  inputSearch = new FormControl('')

  results = this.inputSearch.valueChanges
    .pipe(
      filter(value => value.length >= this.minChars),
      debounceTime(this.timeout),
      map(value => `https://api.github.com/search/repositories?q=${value}`),
      retry(this.maxAttempts),
      switchMap(url => this.http.get(url)),
      map(json => json['items']),
      tap(() => this.isLoaded = true)
    )
    .subscribe(items => this.results = items)

  constructor(private http: HttpClient ) {}
}