import { Component, OnInit, computed, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { SessionService } from '../../services/session.service';

type Park = {
  id: string;
  name: string;
  logoText: string;
  logoClass: string;
};

type Reward = {
  id: number;
  park_id: string;
  discount_percent: number;
  cost: number;
};

type Redemption = {
  discount_percent: number;
  discount_code: string;
};

@Component({
  selector: 'app-rewards',
  imports: [],
  templateUrl: './rewards.html',
  styleUrl: './rewards.scss',
})
export class Rewards implements OnInit {
  protected readonly availablePoints = signal(0);
  protected readonly selectedPark = signal<Park | null>(null);
  protected readonly selectedReward = signal<Reward | null>(null);
  protected readonly pendingReward = signal<Reward | null>(null);
  protected readonly redemption = signal<Redemption | null>(null);
  protected readonly parkRewards = signal<Reward[]>([]);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');
  private userId: number | null = null;

  protected readonly parks: Park[] = [
    { id: 'zoo', name: 'Zoo', logoText: 'ZOO', logoClass: 'rewards-park-logo--zoo' },
    { id: 'warner', name: 'Warner', logoText: 'WB', logoClass: 'rewards-park-logo--warner' },
    { id: 'faunia', name: 'Faunia', logoText: 'FAUNIA', logoClass: 'rewards-park-logo--faunia' },
    { id: 'aquopolis', name: 'Aquopolis', logoText: 'Aquopolis', logoClass: 'rewards-park-logo--aquopolis' },
  ];

  protected readonly rewardsHeaderTitle = computed(() => this.selectedPark()?.name ?? 'Recompensas');

  constructor(
    private apiService: ApiService,
    private sessionService: SessionService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userId = this.sessionService.getUserId();

    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadCurrentPoints(this.userId);
  }

  protected selectPark(park: Park): void {
    this.selectedPark.set(park);
    this.loadRewards(park.id);
  }

  protected selectReward(reward: Reward): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.pendingReward.set(reward);
  }

  protected cancelRedeem(): void {
    this.pendingReward.set(null);
  }

  protected confirmRedeem(): void {
    const reward = this.pendingReward();

    if (!reward) {
      return;
    }

    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.pendingReward.set(null);
    this.apiService.redeem(this.userId, reward.id).subscribe({
      next: (response: any) => {
        if (response.success) {
          const data = response.data;
          const remainingPoints = Number(data.remaining_points ?? data.points_remaining ?? this.availablePoints());

          this.availablePoints.set(remainingPoints);
          this.sessionService.updateUser({ points: remainingPoints });

          this.selectedReward.set(reward);
          this.redemption.set({
            discount_percent: data.discount_percent,
            discount_code: data.discount_code,
          });
          this.successMessage.set(response.message);
        } else {
          const message = this.getFriendlyErrorMessage(response.message);
          this.errorMessage.set(message);
        }
      },
      error: (error: HttpErrorResponse) => {
        const message = error.error?.message || 'No se pudo conectar con el servidor. Revisa que XAMPP este iniciado.';
        this.errorMessage.set(message);
      },
    });
  }

  protected returnToParks(): void {
    this.selectedPark.set(null);
    this.selectedReward.set(null);
    this.pendingReward.set(null);
    this.redemption.set(null);
  }

  protected returnToRewards(): void {
    this.selectedReward.set(null);
    this.pendingReward.set(null);
    this.redemption.set(null);
  }

  private loadRewards(parkId: string): void {
    this.errorMessage.set('');

    this.apiService.getRewards(parkId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.parkRewards.set(response.data);
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

  private loadCurrentPoints(userId: number): void {
    this.apiService.getProfile(userId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.availablePoints.set(Number(response.data.points ?? 0));
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

  private getFriendlyErrorMessage(message: string): string {
    if (message.toLowerCase().includes('puntos suficientes')) {
      return 'No tienes los puntos suficientes.';
    }

    return message;
  }
}
