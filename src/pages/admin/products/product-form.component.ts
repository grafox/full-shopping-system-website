import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { filter, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = signal(false);
  private productId = signal<number | null>(null);
  pageTitle = signal('Add New Product');

  productForm: FormGroup;

  constructor() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      brand: ['', Validators.required],
      description: ['', Validators.required],
      longDescription: ['', Validators.required],
      image: ['https://picsum.photos/id/1/500/500', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      tap(params => {
        if (params.has('id')) {
          const id = Number(params.get('id'));
          this.isEditMode.set(true);
          this.productId.set(id);
          this.pageTitle.set('Edit Product');
        }
      }),
      filter(() => this.isEditMode()),
      switchMap(() => this.productService.getProductById(this.productId()!))
    ).subscribe(product => {
      if (product) {
        this.productForm.patchValue(product);
      } else {
        // Product not found, redirect
        this.router.navigate(['/admin/products']);
      }
    });
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formValue = this.productForm.value;

    const operation$ = this.isEditMode()
      ? this.productService.updateProduct({ ...formValue, id: this.productId()! } as Product)
      : this.productService.addProduct(formValue as Omit<Product, 'id' | 'rating' | 'reviews'>);
    
    operation$.subscribe(() => {
      this.router.navigate(['/admin/products']);
    });
  }
}
