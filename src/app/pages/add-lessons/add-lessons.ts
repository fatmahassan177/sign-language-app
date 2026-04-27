
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { LessonService } from '../../core/services/lessons-services';
import { CourseService } from '../../core/services/course-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addlesson',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
   templateUrl: './add-lessons.html',
  styleUrl: './add-lessons.css',
})
export class Addlesson implements OnInit {


  lessonForm = new FormGroup({
    title:       new FormControl('', Validators.required),
    description: new FormControl(''),
    order:       new FormControl('', Validators.required),
    courseId:    new FormControl('', Validators.required),
    image:       new FormControl(null),
    video:       new FormControl(null) 
  });

  selectedImageFile: File | null = null;
  selectedVideoFile: File | null = null; 
  previewImage: string | null = null;
  previewVideo: string | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  courses: any[] = [];

  constructor(
    private _lessonS: LessonService,
    private _courseS: CourseService
  ) {}

  ngOnInit(): void {
    this._courseS.getCourses().subscribe({
      next: (res: any) => this.courses = res.data,
      error: (err) => console.log(err)
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
      this.lessonForm.get('image')?.setValue(file);

      
      const reader = new FileReader();
      reader.onload = () => { this.previewImage = reader.result as string; };
      reader.readAsDataURL(file);
    }
  }

  onVideoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedVideoFile = file;
      this.lessonForm.get('video')?.setValue(file);

      
      this.previewVideo = URL.createObjectURL(file);
    }
  }

  
  submit() {
  console.log('submit called');
  console.log('form valid:', this.lessonForm.valid);
  
  if (this.lessonForm.invalid) {
    console.log('form invalid, stopping');
    return;
  }

  this.successMessage = null;
  this.errorMessage   = null;

  const formData = new FormData();
  formData.append('title',    this.lessonForm.get('title')?.value    || '');
  formData.append('order',    String(Number(this.lessonForm.get('order')?.value) || 0));
  formData.append('courseId', this.lessonForm.get('courseId')?.value || '');

  const desc = this.lessonForm.get('description')?.value;
  if (desc && desc.trim() !== '') {
    formData.append('description', desc);
  }

  if (this.selectedImageFile) {
    formData.append('image', this.selectedImageFile);
  }

  if (this.selectedVideoFile) {
    formData.append('video', this.selectedVideoFile);
  }

  formData.forEach((value, key) => console.log(key, ':', value));

  console.log('sending request...');

  this._lessonS.createLesson(formData).subscribe({
    next: (res: any) => {
      console.log('Lesson Created:', res);
      this.successMessage = 'Lesson added successfully!';
      this.lessonForm.reset();
      this.selectedImageFile = null;
      this.selectedVideoFile = null;
      this.previewImage      = null;
      this.previewVideo      = null;
    },
    error: (err) => {
      console.log('Status:', err.status);
      console.log('Full error:', err.error);
      this.errorMessage = err.error?.message || err.error?.error || JSON.stringify(err.error);
    }
  });
}
}
