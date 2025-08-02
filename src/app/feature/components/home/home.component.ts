import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiService } from '../../../core/services/kpi.service';
import { KpiData } from '../../../core/interfaces/kpi.interfaces';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  private kpiService = inject(KpiService);
  
  kpis = signal<KpiData[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadKpiData();
  }

  private loadKpiData(): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.kpiService.getKpiData()
      .subscribe({
        next: (kpis) => {
          this.kpis.set(kpis);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading KPI data:', error);
          this.error.set('Error al cargar los datos de KPI. Por favor, intenta nuevamente.');
          this.isLoading.set(false);
        }
      });
  }

  getProgressBarColor(percentage: number): string {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    if (percentage >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  }

  getProgressBarWidth(percentage: number): string {
    return `${Math.min(percentage, 100)}%`;
  }

  retryLoad(): void {
    this.loadKpiData();
  }
}
