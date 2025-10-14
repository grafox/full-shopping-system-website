import { Injectable, signal, computed, effect, inject, Signal } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductService } from './product.service';

const COMPARISON_KEY = 'angular_shop_comparison';
export const MAX_COMPARISON_ITEMS = 4;

@Injectable({ providedIn: 'root' })
export class ComparisonService {
  private productService: ProductService;
  
  comparisonItems = signal<Product[]>([]);
  
  private productIds: Signal<number[]>;

  comparisonCount: Signal<number>;
  comparisonIdSet: Signal<Set<number>>;
  isFull: Signal<boolean>;

  constructor() {
    this.productService = inject(ProductService);

    this.productIds = computed(() => this.comparisonItems().map(p => p.id));
    this.comparisonCount = computed(() => this.comparisonItems().length);
    this.comparisonIdSet = computed(() => new Set(this.productIds()));
    this.isFull = computed(() => this.comparisonCount() >= MAX_COMPARISON_ITEMS);

    this.loadFromLocalStorage();

    effect(() => {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(COMPARISON_KEY, JSON.stringify(this.productIds()));
      }
    });
  }

  private loadFromLocalStorage() {
    if (typeof localStorage === 'undefined') return;

    const storedIdsJson = localStorage.getItem(COMPARISON_KEY);
    if (!storedIdsJson) return;

    try {
      const storedIds = JSON.parse(storedIdsJson) as number[];
      if (storedIds && storedIds.length > 0) {
        this.productService.getProducts().subscribe(allProducts => {
          const comparisonProducts = allProducts.filter(p => storedIds.includes(p.id));
          this.comparisonItems.set(comparisonProducts);
        });
      }
    } catch (e) {
      console.error('Error parsing comparison items from localStorage', e);
      localStorage.removeItem(COMPARISON_KEY);
    }
  }

  addToComparison(product: Product): void {
    if (this.isFull()) {
      console.warn(`Cannot add more than ${MAX_COMPARISON_ITEMS} items to comparison.`);
      return;
    }
    this.comparisonItems.update(items => {
        if (items.some(p => p.id === product.id)) {
            return items; // Already exists
        }
        return [...items, product];
    });
  }

  removeFromComparison(productId: number): void {
    this.comparisonItems.update(items => items.filter(item => item.id !== productId));
  }

  toggleComparison(product: Product): void {
    if (this.comparisonIdSet().has(product.id)) {
      this.removeFromComparison(product.id);
    } else {
      this.addToComparison(product);
    }
  }

  clearComparison(): void {
    this.comparisonItems.set([]);
  }
}