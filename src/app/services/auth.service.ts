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

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_BASE_URL = 'https://api.superlikerslabs.com/v1';
  private readonly API_KEY = '32e608447ff50d5b6760c335ffe87262';
  private readonly CAMPAIGN = '4u';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  // Signals para el estado
  isLoading = signal(false);
  currentUser = signal<Participant | null>(this.getCurrentUser());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(codigoCliente: string, password: string): Observable<LoginResponse> {
    this.isLoading.set(true);

    const loginData: LoginRequest = {
      api_key: this.API_KEY,
      campaign: this.CAMPAIGN,
      participation: {
        'codigo-de-cliente': codigoCliente,
        password: password
      }
    };

    return this.http.post<LoginResponse>(
      `${this.API_BASE_URL}/microsite/sessions/login`,
      loginData
    ).pipe(
      tap(response => {
        this.isLoading.set(false);
        if (response.ok === 'true' && response.token && response.participant) {
          this.setToken(response.token);
          this.setCurrentUser(response.participant);
          this.isLoggedInSubject.next(true);
          this.currentUser.set(response.participant);
          this.router.navigate(['/home']);
        }
      }),
      catchError(error => {
        this.isLoading.set(false);
        console.error('Login error:', error);
        return of({
          ok: 'false',
          message: 'Error de conexión. Intenta nuevamente.'
        } as LoginResponse);
      })
    );
  }

  signup(
    email: string,
    nombreCompleto: string,
    codigoCliente: string,
    password: string
  ): Observable<SignupResponse> {
    this.isLoading.set(true);

    const signupData: SignupRequest = {
      api_key: this.API_KEY,
      campaign: this.CAMPAIGN,
      properties: {
        email: email,
        'nombre-completo': nombreCompleto,
        'codigo-de-cliente': codigoCliente,
        password: password
      }
    };

    return this.http.post<SignupResponse>(
      `${this.API_BASE_URL}/participants`,
      signupData
    ).pipe(
      tap(response => {
        this.isLoading.set(false);
        if (response.ok === 'true') {
          this.router.navigate(['/home']);
        }
      }),
      catchError(error => {
        this.isLoading.set(false);
        console.error('Signup error:', error);
        return of({
          ok: 'false',
          message: 'Error de conexión. Intenta nuevamente.',
          errors: { 'Conexión': 'Error al conectar con el servidor' }
        } as SignupResponse);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.isLoggedInSubject.next(false);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private setCurrentUser(user: Participant): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private getCurrentUser(): Participant | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
}