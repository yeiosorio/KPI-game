import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupComponent } from './signup.component';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SignupComponent, ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.signupForm.get('name')?.value).toBe('');
    expect(component.signupForm.get('email')?.value).toBe('');
    expect(component.signupForm.get('password')?.value).toBe('');
    expect(component.signupForm.get('confirmPassword')?.value).toBe('');
  });

  it('should validate name field', () => {
    const nameControl = component.signupForm.get('name');
    
    // Test required validation
    nameControl?.setValue('');
    expect(nameControl?.hasError('required')).toBeTruthy();
    
    // Test minlength validation
    nameControl?.setValue('A');
    expect(nameControl?.hasError('minlength')).toBeTruthy();
    
    // Test valid name
    nameControl?.setValue('John Doe');
    expect(nameControl?.valid).toBeTruthy();
  });

  it('should validate email field', () => {
    const emailControl = component.signupForm.get('email');
    
    // Test required validation
    emailControl?.setValue('');
    expect(emailControl?.hasError('required')).toBeTruthy();
    
    // Test email validation
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();
    
    // Test valid email
    emailControl?.setValue('test@example.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should validate password confirmation', () => {
    const passwordControl = component.signupForm.get('password');
    const confirmPasswordControl = component.signupForm.get('confirmPassword');
    
    passwordControl?.setValue('123456');
    confirmPasswordControl?.setValue('654321');
    
    component.signupForm.updateValueAndValidity();
    
    expect(confirmPasswordControl?.hasError('passwordMismatch')).toBeTruthy();
    
    confirmPasswordControl?.setValue('123456');
    component.signupForm.updateValueAndValidity();
    
    expect(confirmPasswordControl?.hasError('passwordMismatch')).toBeFalsy();
  });

  it('should navigate to login when navigateToLogin is called', () => {
    component.navigateToLogin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should set loading state when form is submitted', () => {
    component.signupForm.patchValue({
      name: 'John Doe',
      email: 'test@example.com',
      password: '123456',
      confirmPassword: '123456'
    });
    
    component.onSubmit();
    expect(component.isLoading()).toBeTruthy();
  });
});