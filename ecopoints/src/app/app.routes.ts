import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Profile } from './pages/profile/profile';
import { Register } from './pages/register/register';
import { Rewards } from './pages/rewards/rewards';
import { Scan } from './pages/scan/scan';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'scan', component: Scan },
  { path: 'rewards', component: Rewards },
  { path: 'profile', component: Profile },
];
