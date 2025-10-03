import { Component, ChangeDetectionStrategy, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { finalize } from 'rxjs/operators';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ProductCardComponent],
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private searchService = inject(SearchService);
  
  private allProducts = signal<Product[]>([]);
  isLoading = signal(true);
  searchTerm = this.searchService.searchTerm;

  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      return this.allProducts();
    }
    return this.allProducts().filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.productService.getProducts()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe(prods => {
        this.allProducts.set(prods);
      });
  }
}