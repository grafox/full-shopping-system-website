import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { SearchService } from '../../services/search.service';
import { WishlistService } from '../../services/wishlist.service';
import { ComparisonService } from '../../services/comparison.service';
import { AuthService } from '../../services/auth.service';

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
  comparisonService = inject(ComparisonService);
  authService = inject(AuthService);
  private router = inject(Router);
  
  cartCount = this.cartService.cartCount;
  wishlistCount = this.wishlistService.wishlistCount;
  comparisonCount = this.comparisonService.comparisonCount;
  searchTerm = this.searchService.searchTerm;
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchService.setSearchTerm(target.value);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
