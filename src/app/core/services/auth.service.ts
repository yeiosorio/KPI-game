import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  LoginResponse,
  SignupResponse,
  LoginRequest,
  SignupRequest,
  Participant
} from '../interfaces/auth.interfaces';
import { API_CONFIG, STORAGE_KEYS, ROUTES, API_ENDPOINTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  // Signals para el estado
  isLoading = signal(false);
  currentUser = signal<Participant | null>(this.getCurrentUser());

  constructor(private http: HttpClient, private router: Router) { }

  login(loginData: any): Observable<LoginResponse> {
    this.isLoading.set(true);

    const requestData: LoginRequest = {
      api_key: API_CONFIG.API_KEY,
      campaign: API_CONFIG.CAMPAIGN,
      participation: {
        'codigo-de-cliente': loginData.codigoCliente,
        password: loginData.password
      }
    };

    return this.http.post<LoginResponse>(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.auth.login}`,
      requestData
    ).pipe(
      tap(response => {
        this.isLoading.set(false);
        if (response.ok === 'true' && response.token && response.participant) {
          this.setToken(response.token);
          this.setCurrentUser(response.participant);
          this.isLoggedInSubject.next(true);
          this.currentUser.set(response.participant);
          this.router.navigate([ROUTES.HOME]);
        }
      }),
      catchError(error => {
        this.isLoading.set(false);
        console.error('Login error:', error);
        return of({
          ok: 'false',
          message: 'Error en los datos del usuario.'
        } as LoginResponse);
      })
    );
  }

  signup(signupData: any): Observable<SignupResponse> {
    this.isLoading.set(true);

    const requestData: SignupRequest = {
      api_key: API_CONFIG.API_KEY,
      campaign: API_CONFIG.CAMPAIGN,
      properties: {
        email: signupData.email,
        'nombre-completo': signupData.nombreCompleto,
        'codigo-de-cliente': signupData.codigoCliente,
        password: signupData.password
      }
    };

    return this.http.post<SignupResponse>(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.auth.signup}`,
      requestData
    ).pipe(
      tap(response => {
        this.isLoading.set(false);
        if (response.ok === 'true') {
          this.router.navigate([ROUTES.LOGIN]);
        }
      }),
      catchError(error => {
        this.isLoading.set(false);
        console.error('Signup error:', error);
        return of({
          ok: 'false',
          message: 'Error en los datos registrados.',
          errors: { 'Error': 'en los datos ingresados.' }
        } as SignupResponse);
      })
    );
  }

  logout(): void {
    this.isLoading.set(true);
    
    // Hacer la llamada al endpoint de logout
    this.http.post(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.auth.logout}`, {})
      .pipe(
        tap(() => {
          this.clearAuthData();
        }),
        catchError(error => {
          console.error('Logout error:', error);
          // Limpiar datos localmente aunque falle el endpoint
          this.clearAuthData();
          return of(null);
        })
      ).subscribe();
  }

  private clearAuthData(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    this.isLoggedInSubject.next(false);
    this.currentUser.set(null);
    this.isLoading.set(false);
    this.router.navigate([ROUTES.LOGIN]);
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  private setToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }

  private setCurrentUser(user: Participant): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  private getCurrentUser(): Participant | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  }
}