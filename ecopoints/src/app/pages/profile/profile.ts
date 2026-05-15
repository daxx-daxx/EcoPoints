import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { SessionService, SessionUser } from '../../services/session.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  userName = '';
  userEmail = '';
  totalEcoPoints = 0;
  recycledTimes = 0;
  savedCo2Kg = 0;
  errorMessage = '';
  loading = true;

  constructor(
    private apiService: ApiService,
    private sessionService: SessionService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  private loadProfile() {
    this.errorMessage = '';
    this.loading = true;

    const sessionUser = this.sessionService.getUser();

    if (!sessionUser?.id) {
      this.router.navigate(['/login']);
      return;
    }

    this.setInitialProfileData(sessionUser);

    this.apiService.getProfile(sessionUser.id).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.setProfileData(response.data);
          this.sessionService.updateUser({
            id: Number(response.data.id),
            name: response.data.name,
            email: response.data.email,
            points: Number(response.data.points ?? 0),
            recycled_count: Number(response.data.recycled_count ?? 0),
            co2_saved: this.savedCo2Kg,
          });
        } else {
          this.errorMessage = response.message;
        }

        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message || 'No se pudo conectar con el servidor. Revisa que XAMPP este iniciado.';
        this.loading = false;
      },
    });
  }

  private setInitialProfileData(user: SessionUser) {
    const recycledCount = Number(user.recycled_count ?? 0);

    this.userName = user.name ?? '';
    this.userEmail = user.email ?? '';
    this.totalEcoPoints = Number(user.points ?? 0);
    this.recycledTimes = recycledCount;
    this.savedCo2Kg = this.getCo2Saved(user.co2_saved, recycledCount);
  }

  private setProfileData(user: any) {
    const recycledCount = Number(user.recycled_count ?? 0);

    this.userName = user.name ?? '';
    this.userEmail = user.email ?? '';
    this.totalEcoPoints = Number(user.points ?? 0);
    this.recycledTimes = recycledCount;
    this.savedCo2Kg = this.getCo2Saved(user.co2_saved, recycledCount);
  }

  private getCo2Saved(co2Saved: unknown, recycledCount: number): number {
    if (co2Saved !== undefined && co2Saved !== null && co2Saved !== '') {
      return Number(co2Saved);
    }

    return Number((recycledCount * 0.1).toFixed(2));
  }

  logout() {
    this.sessionService.clearUser();
    this.router.navigate(['/login'], {
      state: { toastMessage: 'Sesion cerrada correctamente.' },
    });
  }

}
