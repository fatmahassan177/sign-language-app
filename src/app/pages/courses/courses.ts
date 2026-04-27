
import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../core/services/course-service';
import { ICourse } from '../../core/Model/courses.model';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
})
export class Courses implements OnInit {

  
  private coursesSubject = new BehaviorSubject<any>(null);
  courses$ = this.coursesSubject.asObservable();

  courseForm!: FormGroup;
  selectedFile: File | null = null;
  currentCourseId: string | null = null;
  showModal = false;
  previewImage: string | null = null;
  private currentImageUrl: string | null = null;

  constructor(private _courseS: CourseService) {
    this.courseForm = new FormGroup({
      name:       new FormControl('', Validators.required),
      order:      new FormControl('', Validators.required),
      levelId:    new FormControl('', Validators.required),
      categoryId: new FormControl('', Validators.required),
      image:      new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.getCourses();
  }

  getCourses() {
    this._courseS.getCourses().subscribe({
      next: (res: any) => {
        this.coursesSubject.next(res);
      },
      error: (err) => console.log(err)
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.courseForm.get('image')?.setValue(file);

      const reader = new FileReader();
      reader.onload = () => {
        
        this.previewImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  openEditModal(course: ICourse) {
    this.currentCourseId = course.id!;

    this.courseForm.patchValue({
      name:       course.name,
      order:      course.order,
      levelId:    course.levelId,
      categoryId: course.categoryId
    });

    
    this.currentImageUrl = course.imageUrl || null;

    
    this.previewImage = course.imageUrl
      ? 'https://itkalemsign.runasp.net' + course.imageUrl
      : null;

    
    this.selectedFile = null;
    this.courseForm.get('image')?.setValue(null);

    this.showModal = true;
  }

  submit() {
    if (!this.currentCourseId || this.courseForm.invalid) return;

    const formData = new FormData();
    formData.append('name',       this.courseForm.get('name')?.value || '');
    formData.append('order',      this.courseForm.get('order')?.value?.toString() || '0');
    formData.append('levelId',    this.courseForm.get('levelId')?.value || '');
    formData.append('categoryId', this.courseForm.get('categoryId')?.value || '');

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this._courseS.updateCourse(this.currentCourseId, formData).subscribe({
      next: (res: any) => {
       
        const current = this.coursesSubject.getValue();
        if (current?.data) {
          const updatedData = current.data.map((c: ICourse) => {
            if (c.id === this.currentCourseId) {
              return {
                ...c,
                name:       res.data?.name       ?? this.courseForm.get('name')?.value,
                order:      res.data?.order      ?? this.courseForm.get('order')?.value,
                levelId:    res.data?.levelId    ?? this.courseForm.get('levelId')?.value,
                categoryId: res.data?.categoryId ?? this.courseForm.get('categoryId')?.value,
                imageUrl:   res.data?.imageUrl   || this.currentImageUrl
              };
            }
            return c;
          });
          this.coursesSubject.next({ ...current, data: updatedData });
        }
        this.resetForm();
      },
      error: err => console.log(err)
    });
  }

  deleteCourse(id: string) {
    if (!confirm('Are you sure you want to delete this course?')) return;

    this._courseS.deleteCourse(id).subscribe({
      next: () => {
        
        const current = this.coursesSubject.getValue();
        if (current?.data) {
          const updatedData = current.data.filter((c: ICourse) => c.id !== id);
          this.coursesSubject.next({ ...current, data: updatedData });
        }
      },
      error: err => console.log(err)
    });
  }

  resetForm() {
    this.courseForm.reset();
    this.selectedFile = null;
    this.currentCourseId = null;
    this.currentImageUrl = null;
    this.showModal = false;
    this.previewImage = null;
  }
}