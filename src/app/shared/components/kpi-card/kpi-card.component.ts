import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiData } from '../../../core/interfaces/kpi.interfaces';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KpiCardComponent {
  kpi = input.required<KpiData>();
  chartIndex = input.required<number>();

  getStatusText(percentage: number): string {
    if (percentage >= 90) return 'Excelente';
    if (percentage >= 70) return 'Bueno';
    if (percentage >= 50) return 'Regular';
    return 'Necesita Atención';
  }

  getBadgeClass(percentage: number): string {
    if (percentage >= 90) return 'bg-green-500/20 text-green-300 border border-green-500/30';
    if (percentage >= 70) return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30';
    if (percentage >= 50) return 'bg-orange-500/20 text-orange-300 border border-orange-500/30';
    return 'bg-red-500/20 text-red-300 border border-red-500/30';
  }
}