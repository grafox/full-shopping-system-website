import { Injectable, signal, effect } from '@angular/core';

const SEARCH_TERM_KEY = 'angular_shop_search_term';

@Injectable({ providedIn: 'root' })
export class SearchService {
  searchTerm = signal<string>('');

  constructor() {
    if (typeof localStorage !== 'undefined') {
      this.searchTerm.set(localStorage.getItem(SEARCH_TERM_KEY) ?? '');
    }

    effect(() => {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(SEARCH_TERM_KEY, this.searchTerm());
      }
    });
  }

  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  clearSearchTerm(): void {
    this.searchTerm.set('');
  }
}