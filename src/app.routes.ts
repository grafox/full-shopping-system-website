import { Routes } from '@angular/router';
import { SiteLayoutComponent } from './layouts/site-layout.component';
import { AdminLayoutComponent } from './pages/admin/layout/admin-layout.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const appRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    title: 'Login - Angular Shop'
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Dashboard - Admin'
      },
      { 
        path: 'products', 
        loadComponent: () => import('./pages/admin/products/product-list.component').then(m => m.ProductListComponent),
        canActivate: [adminGuard],
        title: 'Manage Products - Admin'
      },
      { 
        path: 'products/add', 
        loadComponent: () => import('./pages/admin/products/product-form.component').then(m => m.ProductFormComponent),
        canActivate: [adminGuard],
        title: 'Add Product - Admin'
      },
      { 
        path: 'products/edit/:id', 
        loadComponent: () => import('./pages/admin/products/product-form.component').then(m => m.ProductFormComponent),
        canActivate: [adminGuard],
        title: 'Edit Product - Admin'
      },
      { 
        path: 'users', 
        loadComponent: () => import('./pages/admin/users/user-list.component').then(m => m.UserListComponent),
        canActivate: [adminGuard],
        title: 'Manage Users - Admin'
      },
      { 
        path: 'users/add', 
        loadComponent: () => import('./pages/admin/users/user-form.component').then(m => m.UserFormComponent),
        canActivate: [adminGuard],
        title: 'Add User - Admin'
      },
      { 
        path: 'users/edit/:id', 
        loadComponent: () => import('./pages/admin/users/user-form.component').then(m => m.UserFormComponent),
        canActivate: [adminGuard],
        title: 'Edit User - Admin'
      },
      { 
        path: 'analysis', 
        loadComponent: () => import('./pages/admin/analysis/analysis.component').then(m => m.AnalysisComponent),
        canActivate: [adminGuard],
        title: 'Analysis - Admin'
      },
    ]
  },
  {
    path: '',
    component: SiteLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
        title: 'Home - Angular Shop'
      },
      {
        path: 'product/:id',
        loadComponent: () => import('./pages/product-details/product-details.component').then(m => m.ProductDetailsComponent),
        title: 'Product Details - Angular Shop'
      },
      {
        path: 'cart',
        loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent),
        title: 'Your Cart - Angular Shop'
      },
      {
        path: 'wishlist',
        loadComponent: () => import('./pages/wishlist/wishlist.component').then(m => m.WishlistComponent),
        title: 'Your Wishlist - Angular Shop'
      },
      {
        path: 'compare',
        loadComponent: () => import('./pages/compare/compare.component').then(m => m.ComparisonComponent),
        title: 'Compare Products - Angular Shop'
      },
      {
        path: 'checkout',
        loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent),
        title: 'Checkout - Angular Shop'
      },
      {
        path: 'payment',
        loadComponent: () => import('./pages/payment/payment.component').then(m => m.PaymentComponent),
        title: 'Payment - Angular Shop'
      },
      {
        path: 'order-confirmation',
        loadComponent: () => import('./pages/order-confirmation/order-confirmation.component').then(m => m.OrderConfirmationComponent),
        title: 'Order Confirmed - Angular Shop'
      },
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: '404 Not Found - Angular Shop'
  }
];