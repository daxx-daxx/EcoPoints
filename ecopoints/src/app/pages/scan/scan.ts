import { Component, signal } from '@angular/core';

type ScanScreen = 'qr' | 'code' | 'success' | 'error' | 'help';

@Component({
  selector: 'app-scan',
  imports: [],
  templateUrl: './scan.html',
  styleUrl: './scan.scss',
})
export class Scan {
  protected readonly activeScanScreen = signal<ScanScreen>('qr');
  protected readonly earnedPoints = signal(0);

  private readonly sampleValidTicketCode = 'ECO30';
  private readonly sampleTicketPrice = 30;
  private readonly pointsGrowthFactor = 0.02;

  protected showQrScanner(): void {
    this.activeScanScreen.set('qr');
  }

  protected validateRecyclingBin(): void {
    this.activeScanScreen.set('code');
  }

  protected validateTicketCode(ticketCode: string): void {
    if (ticketCode.trim().toUpperCase() !== this.sampleValidTicketCode) {
      this.activeScanScreen.set('error');
      return;
    }

    this.earnedPoints.set(this.calculateTicketPoints(this.sampleTicketPrice));
    this.activeScanScreen.set('success');
  }

  protected showHowItWorks(): void {
    this.activeScanScreen.set('help');
  }

  private calculateTicketPoints(ticketPrice: number): number {
    return Math.round(ticketPrice * (1 + this.pointsGrowthFactor * ticketPrice));
  }
}
