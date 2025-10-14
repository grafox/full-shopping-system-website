
import { Component, ChangeDetectionStrategy, input, inject, computed } from '@angular/core';
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
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  comparisonService = inject(ComparisonService);

  isInWishlist = computed(() => this.wishlistService.wishlistIdSet().has(this.product().id));
  isInComparison = computed(() => this.comparisonService.comparisonIdSet().has(this.product().id));
  isComparisonFull = this.comparisonService.isFull;

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
