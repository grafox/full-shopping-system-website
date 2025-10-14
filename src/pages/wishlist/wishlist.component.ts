import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, ProductCardComponent],
})
export class WishlistComponent {
  wishlistService = inject(WishlistService);
  wishlistItems = this.wishlistService.wishlistItems;
}
