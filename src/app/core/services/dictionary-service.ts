import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../Environment/environment';
import { DictionaryRes } from '../Model/dictionary.model';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DictionaryService {
  constructor(private _http: HttpClient) {}

  private baseUrl  = `${environment.apiUrl}/dictionary`;
  private adminUrl = `${environment.apiUrl}/dictionary/admin/words`;

  getWords() {
    return this._http.get<DictionaryRes>(this.baseUrl).pipe(
      tap((res) => console.log('Dictionary Response:', res)),
      catchError((err) => {
        console.error('Error fetching dictionary:', err);
        return throwError(() => new Error('Failed to load dictionary'));
      })
    );
  }

  createWord(data: FormData) {
    return this._http.post(this.adminUrl, data);
  }


}