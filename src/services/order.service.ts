
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OrderService {
  shippingDetails = signal<any | null>(null);

  setShippingDetails(details: any) {
    this.shippingDetails.set(details);
  }

  clearOrder() {
    this.shippingDetails.set(null);
  }
}
