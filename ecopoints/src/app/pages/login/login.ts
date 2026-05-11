import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  errorMessage = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}

  onLogin(email: string, password: string) {
    this.errorMessage = '';

    this.apiService.login(email, password).subscribe({
      next: (response: any) => {
        if (response.success) {
          localStorage.setItem('currentUser', JSON.stringify(response.data));
          this.router.navigate(['/scan']);
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
