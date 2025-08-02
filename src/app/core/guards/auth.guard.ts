import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ROUTES } from '../constants/app.constants';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isLoggedIn(); // Llamar al método isLoggedIn()
  console.log('User authenticated:', isAuthenticated);

  if (!isAuthenticated) {
    router.navigate([ROUTES.LOGIN]);
    return false;
  }
  /* En caso de estar logueado */
  if (state.url === ROUTES.LOGIN) {
    router.navigate([ROUTES.HOME]);
    return false;
  }
  return true;
};