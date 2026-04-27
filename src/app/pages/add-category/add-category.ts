
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../core/services/category-services';

@Component({
  selector: 'app-addcategory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-category.html',
  styleUrl: './add-category.css',
})
export class Addcategory {

  categoryForm = new FormGroup({
    name:  new FormControl('', Validators.required),
    image: new FormControl(null)
  });

  selectedFile: File | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private _catS: CategoryService) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.categoryForm.get('image')?.setValue(file);
    }
  }

  submit() {
    if (this.categoryForm.invalid) return;

    this.successMessage = null;
    this.errorMessage   = null;

    const formData = new FormData();
    formData.append('name', this.categoryForm.get('name')?.value || '');
    if (this.selectedFile) formData.append('image', this.selectedFile);

    this._catS.createCategory(formData).subscribe({
      next: (res) => {
        console.log('Category Created', res);
        this.successMessage = '✓ Category added successfully!';
        this.categoryForm.reset();
        this.selectedFile = null;
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = err.error?.message || err.error?.error || 'Something went wrong!';
        setTimeout(() => this.errorMessage = null, 3000);
      }
    });
  }
}