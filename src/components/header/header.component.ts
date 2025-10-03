import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, CommonModule]
})
export class HeaderComponent {
  cartService = inject(CartService);
  searchService = inject(SearchService);
  cartCount = this.cartService.cartCount;
  searchTerm = this.searchService.searchTerm;
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchService.setSearchTerm(target.value);
  }
}