import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = API_CONFIG.BASE_URL;

  /**
   * Perform a GET request
   * @param url The endpoint URL (will be appended to baseUrl)
   * @param params Optional query parameters
   * @returns Observable of the response
   */
  get<T>(url: string, params?: any): Observable<T> {
    const httpParams = this.buildParams(params);
    return this.http.get<T>(`${this.baseUrl}/${url}`, { params: httpParams });
  }

  /**
   * Perform a POST request
   * @param url The endpoint URL (will be appended to baseUrl)
   * @param body The request body
   * @param params Optional query parameters
   * @returns Observable of the response
   */
  post<T>(url: string, body: any, params?: any): Observable<T> {
    const httpParams = this.buildParams(params);
    return this.http.post<T>(`${this.baseUrl}/${url}`, body, { params: httpParams });
  }

  /**
   * Build HttpParams from an object
   * @param params Object containing query parameters
   * @returns HttpParams instance
   */
  private buildParams(params?: any): HttpParams {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    
    return httpParams;
  }
}