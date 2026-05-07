import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

type FooterNavigationItem = {
  route: string;
  iconName: 'scan' | 'rewards' | 'profile';
  label: string;
};

@Component({
  selector: 'app-footer',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  readonly footerNavigationItems: FooterNavigationItem[] = [
    { route: '/scan', iconName: 'scan', label: 'Escanear' },
    { route: '/rewards', iconName: 'rewards', label: 'Recompensas' },
    { route: '/profile', iconName: 'profile', label: 'Perfil' },
  ];
}
