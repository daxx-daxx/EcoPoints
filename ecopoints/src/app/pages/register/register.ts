import { Component, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}

  onRegister(name: string, email: string, password: string, confirmPassword: string) {
    this.errorMessage.set('');
    this.successMessage.set('');
    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName || !cleanEmail || !password || !confirmPassword) {
      this.errorMessage.set('Todos los campos son obligatorios.');
      return;
    }

    if (!this.isValidEmail(cleanEmail)) {
      this.errorMessage.set('Introduce un email valido.');
      return;
    }

    if (password !== confirmPassword) {
      this.errorMessage.set('Las contrasenas no coinciden.');
      return;
    }

    this.apiService.register(cleanName, cleanEmail, password).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.successMessage.set(response.message);
          setTimeout(() => this.router.navigate(['/login']), 700);
        } else {
          this.errorMessage.set(response.message);
        }
      },
      error: (error: HttpErrorResponse) => {
        const message = error.error?.message || 'No se pudo conectar con el servidor. Revisa que XAMPP este iniciado.';
        this.errorMessage.set(message);
      },
    });
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
