import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, ParamMap } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { switchMap, filter, tap, map } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, FormsModule],
})
export class ProductDetailsComponent implements OnInit {
  // FIX: Explicitly type injected services to resolve type inference issues.
  private route: ActivatedRoute = inject(ActivatedRoute);
  private productService: ProductService = inject(ProductService);
  private cartService: CartService = inject(CartService);

  product = signal<Product | undefined>(undefined);
  quantity = signal(1);

  isLoading = signal(true);

  private product$ = this.route.paramMap.pipe(
    // FIX: Explicitly type `params` as `ParamMap` to resolve `unknown` type error on `get`.
    map((params: ParamMap) => Number(params.get('id'))),
    // FIX: Explicitly type `id` and add validation to ensure it's a positive number.
    // This prevents errors where `id` might be inferred as `unknown`.
    filter((id: number) => !isNaN(id) && id > 0),
    tap(() => this.isLoading.set(true)),
    // FIX: Explicitly type `id` to fix `unknown` type assignment error.
    switchMap((id: number) => this.productService.getProductById(id)),
    tap(() => this.isLoading.set(false))
  );

  ngOnInit() {
    this.product$.subscribe(p => this.product.set(p));
  }

  addToCart() {
    const p = this.product();
    if (p) {
      this.cartService.addToCart(p, this.quantity());
    }
  }
}
