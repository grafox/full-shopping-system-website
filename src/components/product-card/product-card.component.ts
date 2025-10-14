
import { Component, ChangeDetectionStrategy, input, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';

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

  isInWishlist = computed(() => this.wishlistService.wishlistIdSet().has(this.product().id));

  onAddToCart(): void {
    this.cartService.addToCart(this.product());
  }

  onToggleWishlist(): void {
    this.wishlistService.toggleWishlist(this.product());
  }
}
