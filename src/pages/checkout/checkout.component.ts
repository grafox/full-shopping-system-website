import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, ReactiveFormsModule]
})
export class CheckoutComponent implements OnInit {
  private fb: FormBuilder;
  private router: Router;
  private orderService: OrderService;
  cartService: CartService;
  checkoutForm: FormGroup;

  constructor() {
    this.fb = inject(FormBuilder);
    this.router = inject(Router);
    this.orderService = inject(OrderService);
    this.cartService = inject(CartService);

    this.checkoutForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]],
    });
  }

  ngOnInit(): void {
    if(this.cartService.cartItems().length === 0){
      this.router.navigate(['/']);
    }
  }

  get formControls() {
    return this.checkoutForm.controls;
  }

  proceedToPayment() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }
    
    this.orderService.setShippingDetails(this.checkoutForm.value);
    this.router.navigate(['/payment']);
  }
}