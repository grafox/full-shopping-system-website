import { Injectable, signal, computed, Signal } from '@angular/core';
import { CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly SHIPPING_COST = 5.99;
  
  cartItems = signal<CartItem[]>([]);

  cartCount: Signal<number>;
  subtotal: Signal<number>;
  shipping: Signal<number>;
  total: Signal<number>;

  constructor() {
    this.cartCount = computed(() => 
      this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
    );
  
    this.subtotal = computed(() => 
      this.cartItems().reduce((acc, item) => acc + item.product.price * item.quantity, 0)
    );
  
    this.shipping = computed(() => this.cartItems().length > 0 ? this.SHIPPING_COST : 0);
    
    this.total = computed(() => this.subtotal() + this.shipping());
  }


  addToCart(product: Product, quantity: number = 1): void {
    this.cartItems.update(items => {
      const existingItem = items.find(item => item.product.id === product.id);
      if (existingItem) {
        return items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...items, { product, quantity }];
    });
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartItems.update(items =>
      items.map(item =>
        item.product.id === productId ? { ...item, quantity: quantity } : item
      )
    );
  }

  removeFromCart(productId: number): void {
    this.cartItems.update(items => items.filter(item => item.product.id !== productId));
  }

  clearCart(): void {
    this.cartItems.set([]);
  }
}