

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../Environment/environment';
import { CourseRes } from '../Model/courses.model';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(private _http: HttpClient) {}

  private baseUrl = `${environment.apiUrl}/courses`;
  private adminUrl = `${environment.apiUrl}/admin/courses`;

  getCourses() {
    return this._http.get<CourseRes>(this.baseUrl).pipe(
      tap((res) => console.log('Courses Response:', res)),
      catchError((err) => {
        console.error('Error fetching courses:', err);
        return throwError(() => new Error('Failed to load courses'));
      })
    );
  }

  createCourse(data: FormData) {
    return this._http.post(this.adminUrl, data);
  }

  updateCourse(id: string, data: FormData) {
    return this._http.put(`${this.adminUrl}/${id}`, data);
  }

  deleteCourse(id: string) {
    return this._http.delete(`${this.adminUrl}/${id}`);
  }
}