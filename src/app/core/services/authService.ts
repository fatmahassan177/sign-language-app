import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, tap } from 'rxjs';
import { IUser, ILogin, ILoginResponse } from '../Model/user.model';
import { environment } from '../../Environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private TOKEN_KEY = 'token';
  private baseUrl = `${environment.apiUrl}/auth`;

  private currentUserSubject =
    new BehaviorSubject<IUser | null>(this.getUserFromToken());

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

 
login(data: ILogin) {
  return this.http.post<ILoginResponse>(
    `${this.baseUrl}/login`,
    data
  ).pipe(
    tap(res => {

      const token = res.accessToken;   

      localStorage.setItem(this.TOKEN_KEY, token);

      const user = this.getUserFromToken();
      this.currentUserSubject.next(user);
    })
  );
}

  
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

 
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  
  getUserFromToken(): IUser | null {

    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<IUser>(token);

      if (decoded.exp * 1000 > Date.now()) {
        return decoded;
      }

      return null;

    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return this.getUserFromToken() !== null;
  }
}