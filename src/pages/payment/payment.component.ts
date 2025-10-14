import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
})
export class PaymentComponent implements OnInit {
  private fb: FormBuilder;
  private router: Router;
  private orderService: OrderService;
  cartService: CartService;
  paymentForm: FormGroup;
  paymentMethod = signal<'credit-card' | 'stripe'>('credit-card');

  constructor() {
    this.fb = inject(FormBuilder);
    this.router = inject(Router);
    this.orderService = inject(OrderService);
    this.cartService = inject(CartService);

    this.paymentForm = this.fb.group({
      cardholderName: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\\/?([0-9]{2})$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
    });
  }

  ngOnInit(): void {
    if (this.cartService.cartItems().length === 0 || !this.orderService.shippingDetails()) {
      this.router.navigate(['/']);
      return;
    }
  }

  selectPaymentMethod(method: 'credit-card' | 'stripe'): void {
    this.paymentMethod.set(method);
  }

  get formControls() {
    return this.paymentForm.controls;
  }

  submitCreditCardPayment(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }
    console.log('Payment Submitted with Credit Card:', this.paymentForm.value);
    this.finalizeOrder();
  }

  submitStripePayment(): void {
    console.log('Redirecting to Stripe for payment...');
    // In a real app, this would involve Stripe.js or a server-side redirect.
    this.finalizeOrder();
  }

  private finalizeOrder(): void {
    console.log('Finalizing order...');
    console.log('Shipping Details:', this.orderService.shippingDetails());
    console.log('Cart Items:', this.cartService.cartItems());
    
    this.cartService.clearCart();
    this.orderService.clearOrder();
    this.router.navigate(['/order-confirmation']);
  }
}