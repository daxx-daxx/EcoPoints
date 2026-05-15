import { Component, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { SessionService } from '../../services/session.service';

type ScanScreen = 'qr' | 'code' | 'success' | 'error' | 'help';

@Component({
  selector: 'app-scan',
  imports: [],
  templateUrl: './scan.html',
  styleUrl: './scan.scss',
})
export class Scan implements OnInit {
  protected readonly activeScanScreen = signal<ScanScreen>('qr');
  protected readonly earnedPoints = signal(0);
  protected readonly totalPoints = signal(0);
  protected readonly message = signal('');

  private readonly binCode = 'FAUNIA-BIN-001';
  private userId: number | null = null;

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

  protected showQrScanner(): void {
    this.message.set('');
    this.activeScanScreen.set('qr');
  }

  protected validateRecyclingBin(): void {
    this.message.set('');
    this.activeScanScreen.set('code');
  }

  protected validateTicketCode(ticketCode: string): void {
    const cleanTicketCode = ticketCode.trim();

    if (!cleanTicketCode) {
      this.message.set('Introduce el codigo del ticket.');
      this.activeScanScreen.set('error');
      return;
    }

    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.apiService.recycle(this.userId, cleanTicketCode, this.binCode).subscribe({
      next: (response: any) => {
        this.message.set(response.message);

        if (response.success) {
          const pointsEarned = Number(response.data.points_earned ?? 0);
          const totalPoints = Number(response.data.total_points ?? this.totalPoints());
          const currentUser = this.sessionService.getUser();
          const recycledCount = Number(currentUser?.recycled_count ?? 0) + 1;

          this.earnedPoints.set(pointsEarned);
          this.totalPoints.set(totalPoints);
          this.sessionService.updateUser({
            points: totalPoints,
            recycled_count: recycledCount,
            co2_saved: Number((recycledCount * 0.1).toFixed(2)),
          });

          this.activeScanScreen.set('success');
        } else {
          this.activeScanScreen.set('error');
        }
      },
      error: (error: HttpErrorResponse) => {
        const message = error.error?.message || 'No se pudo conectar con el servidor. Revisa que XAMPP este iniciado.';
        this.message.set(message);
        this.activeScanScreen.set('error');
      },
    });
  }

  protected showHowItWorks(): void {
    this.activeScanScreen.set('help');
  }

  private loadCurrentPoints(userId: number): void {
    this.apiService.getProfile(userId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.totalPoints.set(Number(response.data.points ?? 0));
          this.sessionService.updateUser({
            points: Number(response.data.points ?? 0),
            recycled_count: Number(response.data.recycled_count ?? 0),
            co2_saved: Number(response.data.co2_saved ?? 0),
          });
        } else {
          this.message.set(response.message);
          this.activeScanScreen.set('error');
        }
      },
      error: (error: HttpErrorResponse) => {
        const message = error.error?.message || 'No se pudo conectar con el servidor. Revisa que XAMPP este iniciado.';
        this.message.set(message);
        this.activeScanScreen.set('error');
      },
    });
  }
}
