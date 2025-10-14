import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { SearchService } from '../../services/search.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, CommonModule]
})
export class HeaderComponent {
  cartService = inject(CartService);
  searchService = inject(SearchService);
  wishlistService = inject(WishlistService);
  cartCount = this.cartService.cartCount;
  wishlistCount = this.wishlistService.wishlistCount;
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
