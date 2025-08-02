import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { KpiService } from './kpi.service';
import { API_CONFIG } from '../constants/app.constants';

describe('KpiService', () => {
  let service: KpiService;
  let httpMock: HttpTestingController;

  const mockKpiData = [
    {
      id: '1',
      name: 'Revenue',
      value: 150000,
      target: 200000,
      category: 'financial',
      period: '2024-01',
      trend: 'up',
      percentage: 75
    },
    {
      id: '2',
      name: 'Customer Satisfaction',
      value: 4.2,
      target: 4.5,
      category: 'customer',
      period: '2024-01',
      trend: 'down',
      percentage: 93.3
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [KpiService]
    });

    service = TestBed.inject(KpiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getKpis', () => {
    it('should fetch KPIs successfully', () => {
      service.getKpis().subscribe(kpis => {
        expect(kpis).toEqual(mockKpiData);
        expect(kpis.length).toBe(2);
      });

      const req = httpMock.expectOne(`${API_CONFIG.BASE_URL}/kpis`);
      expect(req.request.method).toBe('GET');
      req.flush(mockKpiData);
    });

    it('should handle error when fetching KPIs', () => {
      service.getKpis().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`${API_CONFIG.BASE_URL}/kpis`);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('formatValue', () => {
    it('should format currency values', () => {
      const formatted = service.formatValue(150000, 'currency');
      expect(formatted).toBe('$150,000');
    });

    it('should format percentage values', () => {
      const formatted = service.formatValue(75.5, 'percentage');
      expect(formatted).toBe('75.5%');
    });

    it('should format number values', () => {
      const formatted = service.formatValue(1234.56, 'number');
      expect(formatted).toBe('1,234.56');
    });

    it('should return string value as is', () => {
      const formatted = service.formatValue('Custom Value', 'string');
      expect(formatted).toBe('Custom Value');
    });
  });

  describe('calculatePercentage', () => {
    it('should calculate percentage correctly', () => {
      const percentage = service.calculatePercentage(75, 100);
      expect(percentage).toBe(75);
    });

    it('should handle zero target', () => {
      const percentage = service.calculatePercentage(50, 0);
      expect(percentage).toBe(0);
    });

    it('should handle negative values', () => {
      const percentage = service.calculatePercentage(-25, 100);
      expect(percentage).toBe(-25);
    });
  });

  describe('getTrendIcon', () => {
    it('should return up arrow for positive trend', () => {
      const icon = service.getTrendIcon('up');
      expect(icon).toBe('↗');
    });

    it('should return down arrow for negative trend', () => {
      const icon = service.getTrendIcon('down');
      expect(icon).toBe('↘');
    });

    it('should return horizontal arrow for stable trend', () => {
      const icon = service.getTrendIcon('stable');
      expect(icon).toBe('→');
    });
  });

  describe('getKpisByCategory', () => {
    it('should filter KPIs by category', () => {
      const filteredKpis = service.getKpisByCategory(mockKpiData, 'financial');
      expect(filteredKpis.length).toBe(1);
      expect(filteredKpis[0].category).toBe('financial');
    });

    it('should return all KPIs for "all" category', () => {
      const filteredKpis = service.getKpisByCategory(mockKpiData, 'all');
      expect(filteredKpis.length).toBe(2);
    });

    it('should return empty array for non-existent category', () => {
      const filteredKpis = service.getKpisByCategory(mockKpiData, 'nonexistent');
      expect(filteredKpis.length).toBe(0);
    });
  });
});