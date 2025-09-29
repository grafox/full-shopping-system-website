
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 99.99,
    brand: 'SonicWave',
    description: 'Noise-cancelling over-ear headphones.',
    longDescription: 'Immerse yourself in pure sound with the SonicWave Pro headphones. Featuring advanced noise-cancellation technology, a 30-hour battery life, and crystal-clear audio, these headphones are perfect for music lovers and frequent travelers.',
    image: 'https://picsum.photos/id/1075/500/500',
    stock: 25,
    rating: 4.7,
    reviews: 1250,
  },
  {
    id: 2,
    name: 'Smartwatch Series 7',
    category: 'Electronics',
    price: 399.00,
    brand: 'TechVerse',
    description: 'Stay connected on the go.',
    longDescription: 'The TechVerse Smartwatch Series 7 is your ultimate fitness and health companion. Track your workouts, monitor your heart rate, and get notifications right on your wrist. With a stunning edge-to-edge display and a durable design, it’s built to keep up with your active lifestyle.',
    image: 'https://picsum.photos/id/2/500/500',
    stock: 15,
    rating: 4.9,
    reviews: 890,
  },
  {
    id: 3,
    name: 'Organic Green Tea',
    category: 'Groceries',
    price: 12.50,
    brand: 'PureLeaf',
    description: '100% organic antioxidant-rich green tea.',
    longDescription: 'Start your day with a cup of PureLeaf Organic Green Tea. Sourced from the finest tea gardens, our tea is packed with antioxidants and offers a smooth, refreshing taste. Each box contains 50 eco-friendly tea bags.',
    image: 'https://picsum.photos/id/41/500/500',
    stock: 100,
    rating: 4.5,
    reviews: 450,
  },
  {
    id: 4,
    name: 'Modern Leather Backpack',
    category: 'Fashion',
    price: 149.95,
    brand: 'UrbanCarry',
    description: 'Stylish and durable for daily use.',
    longDescription: 'The UrbanCarry backpack combines style and functionality. Made from genuine leather, it features a padded laptop compartment, multiple pockets for organization, and comfortable shoulder straps. Perfect for work, school, or travel.',
    image: 'https://picsum.photos/id/106/500/500',
    stock: 30,
    rating: 4.6,
    reviews: 320,
  },
  {
    id: 5,
    name: '4K Action Camera',
    category: 'Electronics',
    price: 249.99,
    brand: 'GoCapture',
    description: 'Capture your adventures in stunning 4K.',
    longDescription: 'The GoCapture Pro is a rugged, waterproof action camera that records breathtaking 4K video at 60fps. With advanced image stabilization and a wide-angle lens, you can capture smooth, immersive footage of all your adventures.',
    image: 'https://picsum.photos/id/250/500/500',
    stock: 18,
    rating: 4.8,
    reviews: 780,
  },
  {
    id: 6,
    name: 'Running Shoes',
    category: 'Footwear',
    price: 120.00,
    brand: 'FastFlex',
    description: 'Lightweight and responsive for runners.',
    longDescription: 'Experience ultimate comfort and performance with FastFlex running shoes. The lightweight mesh upper provides breathability, while the responsive foam midsole offers excellent cushioning and energy return. Ideal for both casual jogs and long-distance runs.',
    image: 'https://picsum.photos/id/21/500/500',
    stock: 50,
    rating: 4.7,
    reviews: 650,
  },
];

@Injectable({ providedIn: 'root' })
export class ProductService {
  getProducts(): Observable<Product[]> {
    return of(PRODUCTS).pipe(delay(200));
  }

  getProductById(id: number): Observable<Product | undefined> {
    const product = PRODUCTS.find(p => p.id === id);
    return of(product).pipe(delay(100));
  }
}
