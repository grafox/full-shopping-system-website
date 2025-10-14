import { Component, ChangeDetectionStrategy, inject, signal, OnInit, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { finalize } from 'rxjs/operators';
import { SearchService } from '../../services/search.service';

interface ProductGroup {
  category: string;
  products: Product[];
}

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
  
  filteredProducts: Signal<Product[]>;
  groupedProducts: Signal<ProductGroup[]>;

  constructor() {
    this.filteredProducts = computed(() => {
      const term = this.searchTerm().toLowerCase();
      if (!term) {
        return [];
      }
      return this.allProducts().filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term)
      );
    });
    
    this.groupedProducts = computed<ProductGroup[]>(() => {
      const products = this.allProducts();
      const groups = products.reduce((acc, product) => {
        const category = product.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(product);
        return acc;
      }, {} as Record<string, Product[]>);

      return Object.keys(groups)
        .sort() // Sort categories alphabetically
        .map(category => ({
          category,
          products: groups[category].sort((a, b) => a.name.localeCompare(b.name)) // Sort products alphabetically
        }));
    });
  }

  ngOnInit(): void {
    this.productService.getProducts()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe(prods => {
        this.allProducts.set(prods);
      });
  }
}
