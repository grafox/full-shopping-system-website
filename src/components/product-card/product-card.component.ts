import { Component, ChangeDetectionStrategy, input, inject, computed, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ComparisonService } from '../../services/comparison.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink]
})
export class ProductCardComponent {
  product = input.required<Product>();
  
  // Service properties
  cartService: CartService;
  wishlistService: WishlistService;
  comparisonService: ComparisonService;

  // Derived state signals
  isInWishlist: Signal<boolean>;
  isInComparison: Signal<boolean>;
  isComparisonFull: Signal<boolean>;

  constructor() {
    this.cartService = inject(CartService);
    this.wishlistService = inject(WishlistService);
    this.comparisonService = inject(ComparisonService);

    this.isInWishlist = computed(() => {
      const p = this.product();
      // Although product is a required input, it's safer to check inside computed
      return p ? this.wishlistService.wishlistIdSet().has(p.id) : false;
    });

    this.isInComparison = computed(() => {
      const p = this.product();
      return p ? this.comparisonService.comparisonIdSet().has(p.id) : false;
    });

    this.isComparisonFull = this.comparisonService.isFull;
  }

  onAddToCart(): void {
    this.cartService.addToCart(this.product());
  }

  onToggleWishlist(): void {
    this.wishlistService.toggleWishlist(this.product());
  }

  onToggleComparison(): void {
    this.comparisonService.toggleComparison(this.product());
  }
}