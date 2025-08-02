import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // TODO: Implementar lógica de interceptor de autenticación
  // Ejemplo: agregar token de autorización a las requests
  
  const authToken = ''; // TODO: Obtener token del servicio de auth
  
  if (authToken) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
    return next(authReq);
  }
  
  return next(req);
};