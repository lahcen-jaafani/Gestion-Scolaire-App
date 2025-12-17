import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {jwtDecode} from "jwt-decode";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  private studentId!: number;

  decodeToken(): void {
    const token = localStorage.getItem('token'); // or sessionStorage
    if (token) {
      const decoded: any = jwtDecode(token);
      this.studentId = decoded.user.id; // or 'id', depends on your token payload
    }
  }

  getStudentId(): number {
    return this.studentId;
  }
  // Observable for other components to subscribe to
  getCurrentUser$(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }
  getCurrentProfessorId(): number | null {
    const user = this.getCurrentUser();
    return user?.professorId || null;
  }

  // Synchronous getter


  // Get user from localStorage
  private getUserFromStorage() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Call this on login to update user and localStorage
  setUser(user: any, token: string) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('access_token', token);
    this.currentUserSubject.next(user);
  }

  // Call this on logout
  clearUser() {
    localStorage.clear();
    this.currentUserSubject.next(null);
  }

  private getCurrentUserFromStorage() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }
  getUserRole(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.role || '';
  }
  login(user: any, token: string) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('access_token', token);
    this.currentUserSubject.next(user);  // Emit new user
  }
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token; // true if token exists
  }

  logout() {
    localStorage.clear();
    this.currentUserSubject.next(null);  // Emit null on logout
  }
}
