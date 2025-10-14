import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { BaseChartDirective } from 'ng2-charts';
import { 
  ChartConfiguration, 
  ChartData, 
  ChartType,
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend);

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, BaseChartDirective],
})
export class AnalysisComponent implements OnInit {
  private productService = inject(ProductService);

  isLoading = signal(true);
  
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
        grid: {
          display: false,
        },
      },
      y: {
        type: 'linear',
        min: 0,
        ticks: {
          // This ensures the y-axis has integer values for product counts
          stepSize: 1, 
          precision: 0,
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hiding legend for a single dataset chart
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 12,
        },
        displayColors: false,
      },
    },
  };
  public barChartType: ChartType = 'bar';
  public barChartData = signal<ChartData<'bar'>>({
    labels: [],
    datasets: [],
  });

  ngOnInit() {
    this.productService.getProducts().subscribe(prods => {
      this.processData(prods);
      this.isLoading.set(false);
    });
  }

  private processData(products: Product[]) {
    const counts = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedData = Object.entries(counts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count); // Sort by count descending

    const labels = sortedData.map(d => d.category);
    const data = sortedData.map(d => d.count);

    this.barChartData.set({
      labels: labels,
      datasets: [
        { 
          data: data, 
          label: 'Products', 
          backgroundColor: '#4f46e5', 
          hoverBackgroundColor: '#4338ca',
          borderRadius: 4,
          barPercentage: 0.6,
        }
      ]
    });
  }
}
