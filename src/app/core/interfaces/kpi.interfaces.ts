export interface KpiRequest {
  api_key: string;
  campaign: string;
  date_filter: {
    sdate: string;
    edate: string;
  };
  limit: number;
  _type: string;
  atype: string;
}

export interface KpiEntry {
  data: Record<string, any>;
}

export interface KpiResponse {
  data: {
    entries: KpiEntry[];
  };
}

export interface KpiData {
  name: string;
  metaMes: number;
  avanceActual: number;
  porcentaje: number;
  unidad: 'cartones' | 'hectolitros';
}

export interface ParsedKpiData {
  [kpiName: string]: {
    meta_mes_cartones?: number;
    meta_mes_hectolitros?: number;
    avance_actual_cartones?: number;
    avance_actual_hectolitros?: number;
  };
}