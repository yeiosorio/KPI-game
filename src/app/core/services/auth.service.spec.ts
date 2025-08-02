import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { API_CONFIG, API_ENDPOINTS, STORAGE_KEYS, ROUTES } from '../constants/app.constants';
import { LoginResponse, SignupResponse, Participant } from '../interfaces/auth.interfaces';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockParticipant: Participant = {
    _id: '123',
    email: 'test@example.com',
    name: 'Test User',
    uid: 'test-uid',
    state: 'active'
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: spy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully and store token', () => {
      const loginData = {
        codigoCliente: 'test123',
        password: 'password123'
      };

      const mockResponse: LoginResponse = {
        ok: 'true',
        token: 'test-token',
        participant: mockParticipant,
        message: 'Login successful'
      };

      service.login(loginData).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(service.getToken()).toBe('test-token');
        expect(service.currentUser()).toEqual(mockParticipant);
        expect(routerSpy.navigate).toHaveBeenCalledWith([ROUTES.HOME]);
      });

      const req = httpMock.expectOne(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.auth.login}`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should handle login error', () => {
      const loginData = {
        codigoCliente: 'test123',
        password: 'wrongpassword'
      };

      service.login(loginData).subscribe(response => {
        expect(response.ok).toBe('false');
        expect(service.getToken()).toBeNull();
      });

      const req = httpMock.expectOne(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.auth.login}`);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      // Set up authenticated state
      localStorage.setItem(STORAGE_KEYS.TOKEN, 'test-token');
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockParticipant));
      service.currentUser.set(mockParticipant);
    });

    it('should logout successfully and clear data', () => {
      service.logout();

      const req = httpMock.expectOne(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.auth.logout}`);
      expect(req.request.method).toBe('POST');
      req.flush({});

      expect(service.getToken()).toBeNull();
      expect(service.currentUser()).toBeNull();
      expect(routerSpy.navigate).toHaveBeenCalledWith([ROUTES.LOGIN]);
    });

    it('should clear data even if logout request fails', () => {
      service.logout();

      const req = httpMock.expectOne(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.auth.logout}`);
      req.error(new ErrorEvent('Network error'));

      expect(service.getToken()).toBeNull();
      expect(service.currentUser()).toBeNull();
      expect(routerSpy.navigate).toHaveBeenCalledWith([ROUTES.LOGIN]);
    });
  });

  describe('token management', () => {
    it('should return null when no token exists', () => {
      expect(service.getToken()).toBeNull();
      expect(service.isLoggedIn()).toBeFalse();
    });

    it('should return token when it exists', () => {
      localStorage.setItem(STORAGE_KEYS.TOKEN, 'test-token');
      expect(service.getToken()).toBe('test-token');
      expect(service.isLoggedIn()).toBeTrue();
    });
  });

  describe('signup', () => {
    it('should signup successfully', () => {
      const signupData = {
        email: 'test@example.com',
        nombreCompleto: 'Test User',
        codigoCliente: 'test123',
        password: 'password123'
      };

      const mockResponse: SignupResponse = {
        ok: 'true',
        message: 'Signup successful',
        participant: mockParticipant
      };

      service.signup(signupData).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(routerSpy.navigate).toHaveBeenCalledWith([ROUTES.LOGIN]);
      });

      const req = httpMock.expectOne(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.auth.signup}`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });
});