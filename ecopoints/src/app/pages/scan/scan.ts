import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Html5Qrcode } from 'html5-qrcode';
import { ApiService } from '../../services/api.service';
import { SessionService } from '../../services/session.service';

type ScanScreen = 'qr' | 'code' | 'success' | 'error' | 'help';

@Component({
  selector: 'app-scan',
  imports: [],
  templateUrl: './scan.html',
  styleUrl: './scan.scss',
})
export class Scan implements OnInit, OnDestroy {
  protected readonly scannerElementId = 'bin-qr-reader';
  protected readonly activeScanScreen = signal<ScanScreen>('qr');
  protected readonly earnedPoints = signal(0);
  protected readonly totalPoints = signal(0);
  protected readonly message = signal('');
  protected readonly binCode = signal<string | null>(null);
  protected readonly isScanningBin = signal(false);

  private qrScanner: Html5Qrcode | null = null;
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

  ngOnDestroy(): void {
    void this.stopBinScanner();
  }

  protected showQrScanner(): void {
    void this.stopBinScanner();
    this.message.set('');
    this.activeScanScreen.set('qr');
  }

  protected async startBinScanner(): Promise<void> {
    this.message.set('');

    if (this.isScanningBin()) {
      return;
    }

    try {
      this.qrScanner = new Html5Qrcode(this.scannerElementId);
      this.isScanningBin.set(true);

      await this.qrScanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
          void this.handleBinQrCode(decodedText);
        },
        () => {
          this.message.set('Apunta la camara al QR de la papelera.');
        },
      );
    } catch {
      await this.stopBinScanner();
      this.isScanningBin.set(false);
      this.message.set('No se pudo abrir la camara. Revisa los permisos del navegador.');
      this.activeScanScreen.set('error');
    }
  }

  protected validateTicketCode(ticketCode: string): void {
    const cleanTicketCode = ticketCode.trim();
    const selectedBinCode = this.binCode();

    if (!selectedBinCode) {
      this.message.set('Primero escanea una papelera.');
      this.activeScanScreen.set('error');
      return;
    }

    if (!cleanTicketCode) {
      this.message.set('Introduce el codigo del ticket.');
      this.activeScanScreen.set('error');
      return;
    }

    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.apiService.recycle(this.userId, cleanTicketCode, selectedBinCode).subscribe({
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
    void this.stopBinScanner();
    this.activeScanScreen.set('help');
  }

  private async handleBinQrCode(decodedText: string): Promise<void> {
    const cleanBinCode = decodedText.trim();

    if (!/^FAUNIA-BIN-\d{3}$/.test(cleanBinCode)) {
      this.message.set('El QR no parece ser una papelera EcoPoints valida.');
      return;
    }

    this.binCode.set(cleanBinCode);
    this.message.set('');
    await this.stopBinScanner();
    this.activeScanScreen.set('code');
  }

  private async stopBinScanner(): Promise<void> {
    if (!this.qrScanner) {
      this.isScanningBin.set(false);
      return;
    }

    try {
      if (this.qrScanner.isScanning) {
        await this.qrScanner.stop();
      }

      await this.qrScanner.clear();
    } catch {
      // The camera may already be closed by the browser.
    } finally {
      this.qrScanner = null;
      this.isScanningBin.set(false);
    }
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
