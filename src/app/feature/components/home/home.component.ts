import { Component, OnInit, signal, inject, ChangeDetectionStrategy, AfterViewInit, ElementRef, ViewChild, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiService } from '../../../core/services/kpi.service';
import { AuthService } from '../../../core/services/auth.service';
import { KpiData } from '../../../core/interfaces/kpi.interfaces';
import { KpiCardComponent } from '../../../shared';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, KpiCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('chartsContainer', { static: false }) chartsContainer!: ElementRef;
  private kpiService = inject(KpiService);
  private authService = inject(AuthService);
  
  kpis = signal<KpiData[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  selectedFilter = signal<'todos' | 'cartones' | 'hectolitros'>('todos');
  
  // Computed para KPIs filtrados
  filteredKpis = computed(() => {
    const allKpis = this.kpis();
    const filter = this.selectedFilter();
    
    if (filter === 'todos') {
      return allKpis;
    }
    
    return allKpis.filter(kpi => kpi.unidad === filter);
  });

  ngOnInit(): void {
    this.loadKpiData();
  }

  ngAfterViewInit(): void {
    // Los gráficos se crearán después de cargar los datos
  }

  private loadKpiData(): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.kpiService.getKpiData()
      .subscribe({
        next: (kpis) => {
          this.kpis.set(kpis);
          this.isLoading.set(false);
          // Crear gráficos después de cargar los datos
          setTimeout(() => this.createCharts(), 100);
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

  private createCharts(): void {
    const kpiData = this.filteredKpis();
    if (!kpiData || kpiData.length === 0) return;

    // Esperar a que Angular renderice las tarjetas
    setTimeout(() => {
      kpiData.forEach((kpi, index) => {
        this.createRadialChart(kpi, index);
      });
    }, 50);
  }

  private createRadialChart(kpi: KpiData, index: number): void {
    const chartId = `chart-${index}`;
    
    // Buscar el placeholder específico para este gráfico
    const placeholder = document.querySelector(`[data-chart-index="${index}"]`) as HTMLElement;
    
    if (!placeholder) return;

    // Limpiar el placeholder y crear el contenedor del gráfico
    placeholder.innerHTML = '';
    placeholder.id = chartId;
    placeholder.className = 'chart-container w-48 h-48';

    const options = {
       series: [kpi.porcentaje],
      chart: {
        height: 200,
        type: 'radialBar' as const,
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 1000,
          animateGradually: {
            enabled: true,
            delay: 150 * index
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        }
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: '60%',
            background: 'transparent',
          },
          track: {
            background: '#374151',
            strokeWidth: '100%',
            margin: 5,
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: true,
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#ffffff',
              offsetY: 8,
              formatter: function (val: number) {
                return val + '%';
              }
            }
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: this.getGradientColors(kpi.porcentaje),
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      stroke: {
        lineCap: 'round'
      },
      labels: [kpi.name],
      colors: [this.getChartColor(kpi.porcentaje)]
    };

    const chart = new ApexCharts(document.querySelector(`#${chartId}`), options);
    chart.render();
  }

  private getChartColor(percentage: number): string {
    if (percentage >= 80) return '#10B981'; // Verde
    if (percentage >= 60) return '#F59E0B'; // Amarillo
    if (percentage >= 40) return '#F97316'; // Naranja
    return '#EF4444'; // Rojo
  }

  private getGradientColors(percentage: number): string[] {
    if (percentage >= 80) return ['#34D399'];
    if (percentage >= 60) return ['#FBBF24'];
    if (percentage >= 40) return ['#FB923C'];
    return ['#F87171'];
  }

  logout(): void {
    this.authService.logout();
  }

  openUserMenu(): void {
    // Implementar menú de usuario
    console.log('User menu clicked');
  }



  // Métodos para el filtro
  setFilter(filter: 'todos' | 'cartones' | 'hectolitros'): void {
    this.selectedFilter.set(filter);
    // Recrear gráficos con los datos filtrados
    setTimeout(() => this.createCharts(), 100);
  }

  getFilterButtonClass(filter: 'todos' | 'cartones' | 'hectolitros'): string {
    const isActive = this.selectedFilter() === filter;
    const baseClasses = 'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105';
    
    if (isActive) {
      return `${baseClasses} bg-blue-600 text-white shadow-lg shadow-blue-500/25`;
    }
    
    return `${baseClasses} bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white border border-gray-600/50`;
  }
}
