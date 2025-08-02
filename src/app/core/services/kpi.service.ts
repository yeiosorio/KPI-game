import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { KpiRequest, KpiResponse, KpiData, ParsedKpiData } from '../interfaces/kpi.interfaces';
import { API_CONFIG } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class KpiService {
  private apiService = inject(ApiService);

  getKpiData(): Observable<KpiData[]> {
    const requestBody: KpiRequest = {
      api_key: API_CONFIG.API_KEY,
      campaign: API_CONFIG.CAMPAIGN,
      date_filter: {
        "sdate": "2024-08-01",
        "edate": "2024-08-31"
      },
      limit: 0,
      _type: 'External',
      atype: 'avance_metas'
    };

    return this.apiService.post<KpiResponse>('entries/index', requestBody)
      .pipe(
        map(response => this.parseKpiData(response))
      );
  }

  private parseKpiData(response: KpiResponse): KpiData[] {
    if (!response.data?.entries?.length) {
      return [];
    }

    const kpiMap: ParsedKpiData = {};
    const kpiList: KpiData[] = [];

    // Procesar todas las entradas para agrupar por KPI
    response.data.entries.forEach(entry => {
      Object.keys(entry.data).forEach(key => {
        const value = entry.data[key];

        // Extraer el nombre del KPI y el tipo de dato
        const metaMatch = key.match(/^(.+)_meta_mes_(cartones|hectolitros)$/);
        const avanceMatch = key.match(/^(.+)_avance_actual_(cartones|hectolitros)$/);

        if (metaMatch) {
          const [, kpiName, unidad] = metaMatch;
          if (!kpiMap[kpiName]) {
            kpiMap[kpiName] = {};
          }
          kpiMap[kpiName][`meta_mes_${unidad}` as keyof ParsedKpiData[string]] = Number(value) || 0;
        }

        if (avanceMatch) {
          const [, kpiName, unidad] = avanceMatch;
          if (!kpiMap[kpiName]) {
            kpiMap[kpiName] = {};
          }
          kpiMap[kpiName][`avance_actual_${unidad}` as keyof ParsedKpiData[string]] = Number(value) || 0;
        }
      });
    });

    // Convertir el mapa a lista de KPIs
    Object.keys(kpiMap).forEach(kpiName => {
      const kpiData = kpiMap[kpiName];

      // Verificar si tiene datos de cartones
      if (kpiData.meta_mes_cartones !== undefined && kpiData.avance_actual_cartones !== undefined) {
        const meta = kpiData.meta_mes_cartones;
        const avance = kpiData.avance_actual_cartones;

        if (meta > 0) {
          kpiList.push({
            name: this.formatKpiName(kpiName),
            metaMes: meta,
            avanceActual: avance,
            porcentaje: Math.round((avance / meta) * 100),
            unidad: 'cartones'
          });
        }
      }

      // Verificar si tiene datos de hectolitros
      if (kpiData.meta_mes_hectolitros !== undefined && kpiData.avance_actual_hectolitros !== undefined) {
        const meta = kpiData.meta_mes_hectolitros;
        const avance = kpiData.avance_actual_hectolitros;

        if (meta > 0) {
          kpiList.push({
            name: this.formatKpiName(kpiName),
            metaMes: meta,
            avanceActual: avance,
            porcentaje: Math.round((avance / meta) * 100),
            unidad: 'hectolitros'
          });
        }
      }
    });

    return kpiList;
  }

  private formatKpiName(kpiName: string): string {
    // Convertir el nombre del KPI a formato legible
    return kpiName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}