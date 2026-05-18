import { Component, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');
  protected showPassword = false;

  constructor(
    private apiService: ApiService,
    private sessionService: SessionService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const toastMessage = history.state?.toastMessage;

    if (toastMessage) {
      this.showToast(toastMessage);
    }
  }

  onLogin(email: string, password: string) {
    this.errorMessage.set('');
    this.successMessage.set('');
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      this.errorMessage.set('Introduce tu email.');
      return;
    }

    if (!this.isValidEmail(cleanEmail)) {
      this.errorMessage.set('Introduce un email valido.');
      return;
    }

    if (!password.trim()) {
      this.errorMessage.set('Introduce tu contrasena.');
      return;
    }

    this.apiService.login(cleanEmail, password).subscribe({
      next: (response: any) => {
        if (response?.success === true) {
          this.sessionService.setUser(response.data);
          this.showToast('Sesion iniciada correctamente.');
          setTimeout(() => this.router.navigate(['/scan']), 700);
        } else {
          this.errorMessage.set(this.getLoginErrorMessage(response?.message));
        }
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(error.error?.message || 'No se pudo conectar con el servidor. Revisa que XAMPP este iniciado.');
      },
    });
  }

  protected togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private getLoginErrorMessage(message?: string): string {
    if (message?.toLowerCase().includes('email')) {
      return message;
    }

    return 'Contrasena incorrecta.';
  }

  private showToast(message: string): void {
    this.successMessage.set(message);
    setTimeout(() => this.successMessage.set(''), 1800);
  }
}
