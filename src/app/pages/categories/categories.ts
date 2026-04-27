

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ICategory } from '../../core/Model/categories.model';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../core/services/category-services';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {

  constructor(private _catS: CategoryService) {}

  
  private categoriesSubject = new BehaviorSubject<any>(null);
  categories$ = this.categoriesSubject.asObservable();

  showModal = false;
  currentCategoryId: string | null = null;
  selectedFile: File | null = null;
  previewImage: string | null = null;

  categoryForm = new FormGroup({
    name: new FormControl('', Validators.required),
    image: new FormControl(null)
  });

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this._catS.getCategories().subscribe({
      next: (res) => {
        
        this.categoriesSubject.next(res);
      },
      error: (err) => console.log(err)
    });
  }

  deleteCategory(id: string) {
    if (!confirm("Are you sure?")) return;

    this._catS.deleteCategory(id).subscribe({
      next: () => {
        
        const current = this.categoriesSubject.getValue();
        if (current?.data) {
          const updatedData = current.data.filter((c: ICategory) => c.id !== id);
          this.categoriesSubject.next({ ...current, data: updatedData });
        }
      },
      error: (err) => console.log(err)
    });
  }

  openEditModal(cat: ICategory) {
    this.currentCategoryId = cat.id!;
    this.categoryForm.patchValue({ name: cat.name });
    this.previewImage = 'https://itkalemsign.runasp.net' + cat.imageUrl;
    this.showModal = true;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.categoryForm.get('image')?.setValue(file);
      const reader = new FileReader();
      reader.onload = () => { this.previewImage = reader.result as string; };
      reader.readAsDataURL(file);
    }
  }

  submitEdit() {
    if (!this.currentCategoryId) return;

    const formData = new FormData();
    formData.append('name', this.categoryForm.get('name')?.value || '');
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this._catS.updateCategory(this.currentCategoryId, formData).subscribe({
      next: (res: any) => {
       
        const current = this.categoriesSubject.getValue();
        if (current?.data) {
          const updatedData = current.data.map((c: ICategory) => {
            if (c.id === this.currentCategoryId) {
              return {
                ...c,
                name: this.categoryForm.get('name')?.value || '',
                imageUrl: res.data?.imageUrl || c.imageUrl
              };
            }
            return c;
          });
          this.categoriesSubject.next({ ...current, data: updatedData });
        }
        this.resetForm();
      },
      error: (err) => console.log(err)
    });
  }

  resetForm() {
    this.showModal = false;
    this.categoryForm.reset();
    this.selectedFile = null;
    this.previewImage = null;
    this.currentCategoryId = null;
  }
}