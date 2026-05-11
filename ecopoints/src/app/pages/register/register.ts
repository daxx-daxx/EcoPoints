import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  errorMessage = '';
  successMessage = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}

  onRegister(name: string, email: string, password: string, confirmPassword: string) {
    this.errorMessage = '';
    this.successMessage = '';

    if (password !== confirmPassword) {
      this.errorMessage = 'Las contrasenas no coinciden.';
      return;
    }

    this.apiService.register(name, email, password).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.successMessage = response.message;
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = response.message;
        }
      },
      error: () => {
        this.errorMessage = 'No se pudo conectar con el servidor.';
      },
    });
  }
}
