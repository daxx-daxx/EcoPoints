import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost/ecopoints-backend';

  constructor(private http: HttpClient) {}

  register(name: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/register.php`, {
      name,
      email,
      password,
    });
  }

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/login.php`, {
      email,
      password,
    });
  }

  getProfile(user_id: number) {
    return this.http.post(`${this.apiUrl}/profile.php`, {
      user_id,
    });
  }

  recycle(user_id: number, ticket_code: string, bin_code: string) {
    return this.http.post(`${this.apiUrl}/recycle.php`, {
      user_id,
      ticket_code,
      bin_code,
    });
  }

  getRewards(park_id = 'faunia') {
    return this.http.post(`${this.apiUrl}/rewards.php`, {
      park_id,
    });
  }

  redeem(user_id: number, reward_id: number) {
    return this.http.post(`${this.apiUrl}/redeem.php`, {
      user_id,
      reward_id,
    });
  }
}
