
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink]
})
export class CartComponent {
  cartService = inject(CartService);
  cartItems = this.cartService.cartItems;
  subtotal = this.cartService.subtotal;
  shipping = this.cartService.shipping;
  total = this.cartService.total;

  updateQuantity(item: CartItem, quantityStr: string) {
    const quantity = parseInt(quantityStr, 10);
    if (!isNaN(quantity) && quantity > 0) {
      this.cartService.updateQuantity(item.product.id, quantity);
    }
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }
}
