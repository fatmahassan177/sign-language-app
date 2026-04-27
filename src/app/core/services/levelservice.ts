import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../Environment/environment';
import { Ilevel, LevelRes } from '../Model/levels.model';
import { catchError, tap, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class Levelservice {
   constructor(private _http:HttpClient){}
    private baseUrl = `${environment.apiUrl}/levels`;
 
    
  getLevels() {
    return this._http.get<LevelRes>(this.baseUrl).pipe(
      tap((res) => console.log('levels Response:', res)),
      catchError((err) => {
        console.error('Error fetching levels:', err);
        return throwError(() => new Error('Failed to load levels'));
      })
    );
  }

   createLevel(data: FormData){
    return this._http.post(`${environment.apiUrl}/admin/levels`, data);
  }

  deleteLevel(id: string){
  return this._http.delete(`${environment.apiUrl}/admin/levels/${id}`);
}
 
updateLevel(id: string, data: FormData){
  return this._http.put(`${environment.apiUrl}/admin/levels/${id}`, data);
}

}
