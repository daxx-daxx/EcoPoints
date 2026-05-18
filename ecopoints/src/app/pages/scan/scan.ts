import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
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
  protected readonly activeScanScreen = signal<ScanScreen>('qr');
  protected readonly binCode = signal('');
  protected readonly earnedPoints = signal(0);
  protected readonly totalPoints = signal(0);
  protected readonly message = signal('');
  protected readonly scannerOpen = signal(false);
  protected readonly scannerStarting = signal(false);

  private readonly scannerElementId = 'ecopoints-bin-qr-reader';
  private html5Qrcode: Html5Qrcode | null = null;
  private scannerRunning = false;
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
    this.message.set('');
    void this.stopBinScanner();
    this.activeScanScreen.set('qr');
  }

  protected openBinScanner(): void {
    void this.startBinScanner();
  }

  protected validateRecyclingBin(): void {
    this.message.set('');

    if (!this.binCode()) {
      this.message.set('Primero escanea una papelera.');
      this.activeScanScreen.set('error');
      return;
    }

    this.activeScanScreen.set('code');
  }

  protected validateTicketCode(ticketCode: string): void {
    const cleanTicketCode = ticketCode.trim();

    if (!cleanTicketCode) {
      this.message.set('Introduce el codigo del ticket.');
      this.activeScanScreen.set('error');
      return;
    }

    if (!this.binCode()) {
      this.message.set('Primero escanea una papelera.');
      this.activeScanScreen.set('error');
      return;
    }

    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.apiService.recycle(this.userId, cleanTicketCode, this.binCode()).subscribe({
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

  protected cancelBinScanner(): void {
    void this.stopBinScanner();
    this.message.set('');
  }

  private async startBinScanner(): Promise<void> {
    this.message.set('');

    if (!navigator.mediaDevices?.getUserMedia) {
      this.message.set('Tu navegador no permite usar la camara para escanear QR.');
      this.activeScanScreen.set('error');
      return;
    }

    await this.stopBinScanner();

    this.activeScanScreen.set('qr');
    this.scannerOpen.set(true);
    this.scannerStarting.set(true);

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });

    try {
      this.html5Qrcode = new Html5Qrcode(this.scannerElementId, {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
      });

      await this.html5Qrcode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
          aspectRatio: 1,
        },
        (decodedText) => {
          void this.handleBinCodeDetected(decodedText);
        },
        () => {},
      );

      this.scannerRunning = true;
    } catch (error) {
      this.message.set(this.getCameraErrorMessage(error));
      this.activeScanScreen.set('error');
      await this.stopBinScanner();
    } finally {
      this.scannerStarting.set(false);
    }
  }

  private async handleBinCodeDetected(decodedText: string): Promise<void> {
    const detectedBinCode = decodedText.trim();

    if (!detectedBinCode) {
      this.message.set('El QR no contiene un codigo de papelera valido.');
      await this.stopBinScanner();
      this.activeScanScreen.set('error');
      return;
    }

    this.binCode.set(detectedBinCode);
    this.message.set('');
    await this.stopBinScanner();
    this.activeScanScreen.set('code');
  }

  private async stopBinScanner(): Promise<void> {
    const scanner = this.html5Qrcode;

    if (!scanner) {
      this.scannerOpen.set(false);
      this.scannerStarting.set(false);
      this.scannerRunning = false;
      return;
    }

    try {
      if (this.scannerRunning || scanner.isScanning) {
        await scanner.stop();
      }

      scanner.clear();
    } catch {
      // The camera may already be closed by the browser.
    } finally {
      this.html5Qrcode = null;
      this.scannerOpen.set(false);
      this.scannerStarting.set(false);
      this.scannerRunning = false;
    }
  }

  private getCameraErrorMessage(error: unknown): string {
    const name = error instanceof DOMException ? error.name : '';

    if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
      return 'Permiso de camara denegado. Activalo en el navegador para escanear la papelera.';
    }

    if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
      return 'No se ha detectado ninguna camara disponible.';
    }

    return 'No se pudo abrir la camara. Revisa los permisos del navegador e intentalo de nuevo.';
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
