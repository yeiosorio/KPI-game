import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HomeComponent } from './home.component';
import { AuthService } from '../../../core/services/auth.service';
import { KpiService } from '../../../core/services/kpi.service';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let kpiServiceSpy: jasmine.SpyObj<KpiService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockKpiData = [
    {
      id: '1',
      name: 'Test KPI',
      value: 100,
      target: 120,
      category: 'sales',
      period: '2024-01',
      trend: 'up'
    }
  ];

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['logout']);
    const kpiSpy = jasmine.createSpyObj('KpiService', ['getKpis']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: KpiService, useValue: kpiSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    kpiServiceSpy = TestBed.inject(KpiService) as jasmine.SpyObj<KpiService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Setup default return values
    kpiServiceSpy.getKpis.and.returnValue(of(mockKpiData));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load KPIs on init', () => {
    component.ngOnInit();
    expect(kpiServiceSpy.getKpis).toHaveBeenCalled();
    expect(component.kpis()).toEqual(mockKpiData);
  });

  it('should call authService.logout when logout is called', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it('should filter KPIs by category', () => {
    component.kpis.set(mockKpiData);
    component.selectedCategory.set('sales');
    
    const filteredKpis = component.filteredKpis();
    expect(filteredKpis.length).toBe(1);
    expect(filteredKpis[0].category).toBe('sales');
  });

  it('should filter KPIs by search term', () => {
    component.kpis.set(mockKpiData);
    component.searchTerm.set('Test');
    
    const filteredKpis = component.filteredKpis();
    expect(filteredKpis.length).toBe(1);
    expect(filteredKpis[0].name).toContain('Test');
  });

  it('should return all KPIs when no filters applied', () => {
    component.kpis.set(mockKpiData);
    component.selectedCategory.set('all');
    component.searchTerm.set('');
    
    const filteredKpis = component.filteredKpis();
    expect(filteredKpis.length).toBe(1);
  });

  it('should handle loading state', () => {
    expect(component.isLoading()).toBeFalse();
    
    component.isLoading.set(true);
    expect(component.isLoading()).toBeTrue();
  });
});
