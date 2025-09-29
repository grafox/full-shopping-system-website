
import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ProductCardComponent],
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  
  products = signal<Product[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.productService.getProducts()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe(prods => {
        this.products.set(prods);
      });
  }
}
