
import { Component, ChangeDetectionStrategy, inject, signal, OnInit, computed, Signal } from '@angular/core';
import { ActivatedRoute, RouterLink, ParamMap } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ComparisonService } from '../../services/comparison.service';
import { Product } from '../../models/product.model';
import { switchMap, filter, tap, map, Observable } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, FormsModule],
})
export class ProductDetailsComponent implements OnInit {
  // Services
  private route: ActivatedRoute;
  private productService: ProductService;
  private cartService: CartService;
  private wishlistService: WishlistService;
  private comparisonService: ComparisonService;

  // State signals
  product = signal<Product | undefined>(undefined);
  quantity = signal(1);
  isLoading = signal(true);

  // Derived state signals (computed)
  isInWishlist: Signal<boolean>;
  isInComparison: Signal<boolean>;
  isComparisonFull: Signal<boolean>;

  private product$: Observable<Product | undefined>;

  constructor() {
    // Inject all services within the constructor to guarantee injection context
    this.route = inject(ActivatedRoute);
    this.productService = inject(ProductService);
    this.cartService = inject(CartService);
    this.wishlistService = inject(WishlistService);
    this.comparisonService = inject(ComparisonService);

    // Initialize computed signals that depend on services
    this.isInWishlist = computed(() => {
      const p = this.product();
      return p ? this.wishlistService.wishlistIdSet().has(p.id) : false;
    });

    this.isInComparison = computed(() => {
      const p = this.product();
      return p ? this.comparisonService.comparisonIdSet().has(p.id) : false;
    });
    
    this.isComparisonFull = this.comparisonService.isFull;

    // Initialize the observable stream
    this.product$ = this.route.paramMap.pipe(
      map((params: ParamMap) => Number(params.get('id'))),
      filter((id: number) => !isNaN(id) && id > 0),
      tap(() => this.isLoading.set(true)),
      switchMap((id: number) => this.productService.getProductById(id)),
      tap(() => this.isLoading.set(false))
    );
  }

  ngOnInit() {
    this.product$.subscribe(p => this.product.set(p));
  }

  addToCart() {
    const p = this.product();
    if (p) {
      this.cartService.addToCart(p, this.quantity());
    }
  }

  toggleWishlist() {
    const p = this.product();
    if (p) {
      this.wishlistService.toggleWishlist(p);
    }
  }

  toggleComparison() {
    const p = this.product();
    if (p) {
      this.comparisonService.toggleComparison(p);
    }
  }
}
