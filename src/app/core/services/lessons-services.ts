

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../Environment/environment';
import { LessonRes } from '../Model/lessons.model';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  constructor(private _http: HttpClient) {}

  private baseUrl  = `${environment.apiUrl}/lessons`;
  private adminUrl = `${environment.apiUrl}/admin/lessons`;

  getLessons() {
    return this._http.get<LessonRes>(this.baseUrl).pipe(
      tap((res) => console.log('Lessons Response:', res)),
      catchError((err) => {
        console.error('Error fetching lessons:', err);
        return throwError(() => new Error('Failed to load lessons'));
      })
    );
  }

  createLesson(data: FormData) {
    return this._http.post(this.adminUrl, data);
  }

  updateLesson(id: string, data: FormData) {
    return this._http.put(`${this.adminUrl}/${id}`, data);
  }

  deleteLesson(id: string) {
    return this._http.delete(`${this.adminUrl}/${id}`);
  }
}