
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ComparisonService } from '../../services/comparison.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
})
export class ComparisonComponent {
  comparisonService = inject(ComparisonService);
  comparisonItems = this.comparisonService.comparisonItems;

  displayedAttributes: (keyof Product | 'rating')[] = [
    'name', 'price', 'brand', 'category', 'rating', 'reviews', 'stock', 'description'
  ];

  getAttributeLabel(attribute: string): string {
    return attribute.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  onRemove(productId: number): void {
    this.comparisonService.removeFromComparison(productId);
  }
}
