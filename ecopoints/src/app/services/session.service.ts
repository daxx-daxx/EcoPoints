import { Injectable } from '@angular/core';

export type SessionUser = {
  id: number;
  name?: string;
  email?: string;
  points?: number;
  recycled_count?: number;
  co2_saved?: number;
};

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  currentUser: SessionUser | null = null;

  setUser(user: SessionUser): void {
    this.currentUser = user;
  }

  updateUser(user: Partial<SessionUser>): void {
    if (!this.currentUser) {
      return;
    }

    this.currentUser = {
      ...this.currentUser,
      ...user,
    };
  }

  getUser(): SessionUser | null {
    return this.currentUser;
  }

  getUserId(): number | null {
    return this.currentUser?.id ?? null;
  }

  clearUser(): void {
    this.currentUser = null;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }
}
