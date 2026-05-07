import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly router = inject(Router);
  private readonly currentUrl = signal(this.router.url);

  protected readonly title = signal('ecopoints');
  protected readonly shouldShowFooter = computed(() => {
    const cleanUrl = this.currentUrl().split('?')[0].split('#')[0];

    return cleanUrl !== '/' && cleanUrl !== '/login' && cleanUrl !== '/register';
  });

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.set(event.urlAfterRedirects);
      }
    });
  }
}
