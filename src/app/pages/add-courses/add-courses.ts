

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CourseService } from '../../core/services/course-service';
import { Levelservice } from '../../core/services/levelservice';
import { CategoryService } from '../../core/services/category-services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addcourse',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
   templateUrl: './add-courses.html',
  styleUrl: './add-courses.css',
})
export class Addcourse implements OnInit {

  courseForm = new FormGroup({
    name:       new FormControl('', Validators.required),
    order:      new FormControl('', Validators.required),
    levelId:    new FormControl('', Validators.required),
    categoryId: new FormControl('', Validators.required),
    image:      new FormControl(null)
  });

  selectedFile: File | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;

 
  levels: any[] = [];
  categories: any[] = [];

  constructor(
    private _courseS: CourseService,
    private _levelS: Levelservice,
    private _catS: CategoryService
  ) {}

  ngOnInit(): void {
    
    this._levelS.getLevels().subscribe({
      next: (res: any) => this.levels = res.data,
      error: (err) => console.log(err)
    });

    this._catS.getCategories().subscribe({
      next: (res: any) => this.categories = res.data,
      error: (err) => console.log(err)
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.courseForm.get('image')?.setValue(file);
    }
  }

  submit() {
    if (this.courseForm.invalid) return;

    this.successMessage = null;
    this.errorMessage = null;

    const formData = new FormData();
    formData.append('name',       this.courseForm.get('name')?.value || '');
    formData.append('order',      this.courseForm.get('order')?.value?.toString() || '0');
    formData.append('levelId',    this.courseForm.get('levelId')?.value || '');
    formData.append('categoryId', this.courseForm.get('categoryId')?.value || '');

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this._courseS.createCourse(formData).subscribe({
      next: (res) => {
        console.log('Course Created:', res);
        this.successMessage = 'Course added successfully!';
        this.courseForm.reset();
        this.selectedFile = null;
      },
      error: (err) => {
       
        this.errorMessage = err.error?.error || 'Something went wrong!';
        console.log(err);
      }
    });
  }
}