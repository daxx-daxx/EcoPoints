import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

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
  private currentUser: any = null;

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const currentUserText = localStorage.getItem('currentUser');

    if (!currentUserText) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      this.currentUser = JSON.parse(currentUserText);
    } catch {
      localStorage.removeItem('currentUser');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.currentUser.id) {
      localStorage.removeItem('currentUser');
      this.router.navigate(['/login']);
      return;
    }

    this.totalPoints.set(Number(this.currentUser.points ?? 0));
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

    if (!this.currentUser?.id) {
      this.router.navigate(['/login']);
      return;
    }

    this.apiService.recycle(this.currentUser.id, cleanTicketCode, this.binCode).subscribe({
      next: (response: any) => {
        this.message.set(response.message);

        if (response.success) {
          const pointsEarned = Number(response.data.points_earned ?? 0);
          const totalPoints = Number(response.data.total_points ?? this.totalPoints());

          this.earnedPoints.set(pointsEarned);
          this.totalPoints.set(totalPoints);

          this.currentUser.points = totalPoints;
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

          this.activeScanScreen.set('success');
        } else {
          this.activeScanScreen.set('error');
        }
      },
      error: () => {
        this.message.set('No se pudo conectar con el servidor.');
        this.activeScanScreen.set('error');
      },
    });
  }

  protected showHowItWorks(): void {
    this.activeScanScreen.set('help');
  }
}
