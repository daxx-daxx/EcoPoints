import { Component, computed, signal } from '@angular/core';

type Park = {
  id: string;
  name: string;
  logoText: string;
  logoClass: string;
};

type Reward = {
  discount: number;
  pointsCost: number;
  couponCode: string;
};

@Component({
  selector: 'app-rewards',
  imports: [],
  templateUrl: './rewards.html',
  styleUrl: './rewards.scss',
})
export class Rewards {
  protected readonly availablePoints = 1280;
  protected readonly selectedPark = signal<Park | null>(null);
  protected readonly selectedReward = signal<Reward | null>(null);

  protected readonly parks: Park[] = [
    { id: 'zoo', name: 'Zoo', logoText: 'ZOO', logoClass: 'rewards-park-logo--zoo' },
    { id: 'warner', name: 'Warner', logoText: 'WB', logoClass: 'rewards-park-logo--warner' },
    { id: 'faunia', name: 'Faunia', logoText: 'FAUNIA', logoClass: 'rewards-park-logo--faunia' },
    { id: 'aquopolis', name: 'Aquopolis', logoText: 'Aquopolis', logoClass: 'rewards-park-logo--aquopolis' },
  ];

  protected readonly parkRewards: Reward[] = [
    { discount: 10, pointsCost: 100, couponCode: 'ECO10-WARNER' },
    { discount: 20, pointsCost: 200, couponCode: 'ECO20-WARNER' },
    { discount: 30, pointsCost: 300, couponCode: 'ECO30-WARNER' },
    { discount: 40, pointsCost: 400, couponCode: 'ECO40-WARNER' },
    { discount: 50, pointsCost: 500, couponCode: 'ECO50-WARNER' },
    { discount: 60, pointsCost: 600, couponCode: 'ECO60-WARNER' },
  ];

  protected readonly rewardsHeaderTitle = computed(() => this.selectedPark()?.name ?? 'Recompensas');

  protected selectPark(park: Park): void {
    this.selectedPark.set(park);
  }

  protected selectReward(reward: Reward): void {
    this.selectedReward.set(reward);
  }

  protected returnToParks(): void {
    this.selectedPark.set(null);
    this.selectedReward.set(null);
  }

  protected returnToRewards(): void {
    this.selectedReward.set(null);
  }
}
