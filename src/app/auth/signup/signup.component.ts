import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

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
  errorMessage = signal('');
  errorMessages = signal<string[]>([]);
  
  // Usar el signal de loading del AuthService
  isLoading = signal(false);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.isLoading = this.authService.isLoading;
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
      
      const formData = {
        email: this.signupForm.value.email,
        nombreCompleto: this.signupForm.value['nombre-completo'],
        codigoCliente: this.signupForm.value['codigo-de-cliente'], 
        password: this.signupForm.value.password
      };
      
      this.authService.signup(formData).subscribe({
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