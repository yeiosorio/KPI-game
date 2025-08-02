import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  // TODO: Implementar lógica de autenticación
  // Ejemplo: verificar si el usuario está autenticado
  
  const isAuthenticated = false; // TODO: Obtener estado de autenticación
  
  if (!isAuthenticated) {
    // TODO: Redirigir a login
    
    return false;
  }
  
  return true;
};