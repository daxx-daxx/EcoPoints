import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit, OnDestroy {
  userName = '';
  userEmail = '';
  totalEcoPoints: number | null = null;
  recycledTimes: number | null = null;
  savedCo2Kg: number | null = null;
  errorMessage = '';
  loading = true;
  private routeSubscription?: Subscription;

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadProfile();

    this.routeSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.urlAfterRedirects === '/profile') {
        this.loadProfile();
      }
    });
  }

  ngOnDestroy() {
    this.routeSubscription?.unsubscribe();
  }

  private loadProfile() {
    this.errorMessage = '';
    this.loading = true;

    const currentUserText = localStorage.getItem('currentUser');

    if (!currentUserText) {
      localStorage.removeItem('currentUser');
      this.router.navigate(['/login']);
      return;
    }

    let currentUser;

    try {
      currentUser = JSON.parse(currentUserText);
    } catch {
      localStorage.removeItem('currentUser');
      this.router.navigate(['/login']);
      return;
    }

    if (!currentUser.id) {
      localStorage.removeItem('currentUser');
      this.router.navigate(['/login']);
      return;
    }

    this.userName = currentUser.name ?? '';
    this.userEmail = currentUser.email ?? '';
    this.totalEcoPoints = currentUser.points === undefined ? null : Number(currentUser.points);
    this.recycledTimes = currentUser.recycled_count === undefined ? null : Number(currentUser.recycled_count);
    this.savedCo2Kg = currentUser.co2_saved === undefined ? null : Number(currentUser.co2_saved);

    this.apiService.getProfile(currentUser.id).subscribe({
      next: (response: any) => {
        if (response.success) {
          const user = response.data;

          this.userName = user.name;
          this.userEmail = user.email;
          this.totalEcoPoints = Number(user.points);
          this.recycledTimes = Number(user.recycled_count);
          this.savedCo2Kg = Number(user.co2_saved);

          localStorage.setItem('currentUser', JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            points: user.points,
            recycled_count: user.recycled_count,
            co2_saved: user.co2_saved,
          }));
        } else {
          this.errorMessage = response.message;
        }

        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudo conectar con el servidor.';
        this.loading = false;
      },
    });
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

}
