import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      "codigo-de-cliente": ['', [Validators.required]],
      "password": ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.errorMessage.set('');
      const { 'codigo-de-cliente': codigoCliente, password } = this.loginForm.value;
      
      this.authService.login(codigoCliente, password).subscribe({
        next: (response) => {
          if (response.ok === 'false') {
            this.errorMessage.set(response.message || 'Error en el inicio de sesión');
          }
          // Si ok === 'true', el servicio ya maneja la redirección
        },
        error: (error) => {
          this.errorMessage.set('Error de conexión. Intenta nuevamente.');
          console.error('Login error:', error);
        }
      });
    }
  }

  navigateToSignup(): void {
    this.router.navigate(['/signup']);
  }
}
