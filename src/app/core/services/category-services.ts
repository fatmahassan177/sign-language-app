import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../Environment/environment';
import { CategoryRes } from '../Model/categories.model';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private _http: HttpClient) {}

  private baseUrl = `${environment.apiUrl}/categories`;

  
  getCategories(){
    return this._http.get<CategoryRes>(this.baseUrl).pipe(
      tap(res => console.log("Categories Response:", res)),
      catchError(err=>{
        console.error("Error fetching categories", err);
        return throwError(()=> new Error("Failed to load categories"))
      })
    )
  }

  
  createCategory(data: FormData){
    return this._http.post(`${environment.apiUrl}/admin/categories`, data);
  }

  deleteCategory(id:string){
    return this._http.delete(`${environment.apiUrl}/admin/categories/${id}`);
  }

  
  updateCategory(id:string , data:FormData){
    return this._http.put(`${environment.apiUrl}/admin/categories/${id}`, data);
  }

}