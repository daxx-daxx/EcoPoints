import { Component, computed } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  protected readonly userName = 'Jhon Doe';
  protected readonly userEmail = 'jhondoe@email.com';
  protected readonly totalEcoPoints = 1280;
  protected readonly recycledTimes = 12;
  protected readonly savedCo2Kg = computed(() => (this.recycledTimes * 0.01).toFixed(2));
}
