import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');
  errorMessages = signal<string[]>([]);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.signupForm = this.fb.group({
      'email': ['', [Validators.required, Validators.email]],
      'nombre-completo': ['', [Validators.required]],
      'codigo-de-cliente': ['', [Validators.required]],
      'password': ['', [Validators.required, Validators.minLength(6)]]
    });
  }



  onSubmit(): void {
    if (this.signupForm.valid) {
      this.errorMessage.set('');
      this.errorMessages.set([]);
      
      const formValue = this.signupForm.value;
      const email = formValue.email;
      const nombreCompleto = formValue['nombre-completo'];
      const codigoCliente = formValue['codigo-de-cliente'];
      const password = formValue.password;
      
      this.authService.signup(email, nombreCompleto, codigoCliente, password).subscribe({
        next: (response) => {
          if (response.ok === 'false') {
            if (response.errors) {
              // Convertir objeto de errores a array de mensajes
              const errorList = Object.entries(response.errors).map(
                ([field, message]) => `${field}: ${message}`
              );
              this.errorMessages.set(errorList);
            } else {
              this.errorMessage.set(response.message || 'Error en el registro');
            }
          }
          // Si ok === 'true', el servicio ya maneja la redirección
        },
        error: (error) => {
          this.errorMessage.set('Error de conexión. Intenta nuevamente.');
          console.error('Signup error:', error);
        }
      });
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}