import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductService } from './product.service';

const WISHLIST_KEY = 'angular_shop_wishlist';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private productService = inject(ProductService);
  
  wishlistItems = signal<Product[]>([]);
  
  private productIds = computed(() => this.wishlistItems().map(p => p.id));

  wishlistCount = computed(() => this.wishlistItems().length);
  wishlistIdSet = computed(() => new Set(this.productIds()));

  constructor() {
    this.loadFromLocalStorage();

    effect(() => {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(this.productIds()));
      }
    });
  }

  private loadFromLocalStorage() {
    if (typeof localStorage === 'undefined') return;

    const storedIdsJson = localStorage.getItem(WISHLIST_KEY);
    if (!storedIdsJson) return;

    const storedIds = JSON.parse(storedIdsJson) as number[];
    if (storedIds && storedIds.length > 0) {
      this.productService.getProducts().subscribe(allProducts => {
        const wishlistProducts = allProducts.filter(p => storedIds.includes(p.id));
        this.wishlistItems.set(wishlistProducts);
      });
    }
  }

  addToWishlist(product: Product): void {
    this.wishlistItems.update(items => {
        if (items.some(p => p.id === product.id)) {
            return items; // Already exists
        }
        return [...items, product];
    });
  }

  removeFromWishlist(productId: number): void {
    this.wishlistItems.update(items => items.filter(item => item.id !== productId));
  }

  toggleWishlist(product: Product): void {
    if (this.wishlistIdSet().has(product.id)) {
      this.removeFromWishlist(product.id);
    } else {
      this.addToWishlist(product);
    }
  }
}
