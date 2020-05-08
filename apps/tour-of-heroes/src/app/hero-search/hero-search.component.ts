import { Component, OnInit } from '@angular/core';
import { RxState } from '@rx-angular/state';

import { Observable, Subject } from 'rxjs';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

interface HeroSearchComponentState {
  heroes: Hero[];
}

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css'],
  providers: [RxState]
})
export class HeroSearchComponent {
  readonly heroes$: Observable<Hero[]> = this.state.select('heroes');

  private searchTerms = new Subject<string>();

  private readonly _searchResult$ = this.searchTerms.pipe(
    // wait 300ms after each keystroke before considering the term
    debounceTime(300),

    // ignore new term if same as previous term
    distinctUntilChanged(),

    // switch to new search observable each time the term changes
    switchMap((term: string) => this.heroService.searchHeroes(term))
  );

  constructor(
    public heroService: HeroService,
    private state: RxState<HeroSearchComponentState>
  ) {
    this.state.connect('heroes', this._searchResult$);
  }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }
}