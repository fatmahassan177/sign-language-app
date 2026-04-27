

import { Component, OnInit } from '@angular/core';
import { LessonService } from '../../core/services/lessons-services';
import { ILesson } from '../../core/Model/lessons.model';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { CourseService } from '../../core/services/course-service';

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lessons.html',
  styleUrl: './lessons.css',
})
export class Lessons implements OnInit {

  private lessonsSubject = new BehaviorSubject<any>(null);
  lessons$ = this.lessonsSubject.asObservable();

  lessonForm!: FormGroup;
  selectedImageFile: File | null = null;
  selectedVideoFile: File | null = null;
  currentLessonId: string | null = null;
  showModal = false;
  previewImage: string | null = null;
  previewVideo: string | null = null;
  private currentImageUrl: string | null = null;
   currentVideoUrl: string | null = null;

  
  courses: any[] = [];

  errorMessage: string | null = null;


  showVideoModal = false;


  constructor(
    private _lessonS: LessonService,
    private _courseS: CourseService
  ) {
    this.lessonForm = new FormGroup({
      title:       new FormControl('', Validators.required),
      description: new FormControl(''),
      order:       new FormControl('', Validators.required),
      courseId:    new FormControl('', Validators.required),
      image:       new FormControl(null),
      video:       new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.getLessons();

    
    this._courseS.getCourses().subscribe({
      next: (res: any) => this.courses = res.data,
      error: (err) => console.log(err)
    });
  }

 

  getLessons() {
  this._lessonS.getLessons().subscribe({
    next: (res: any) => {
      
      console.log('Lessons data:', res.data);
      this.lessonsSubject.next(res);
    },
    error: (err) => console.log(err)
  });
}


openVideoModal(videoUrl: string) {
  this.currentVideoUrl = 'https://itkalemsign.runasp.net' + videoUrl;
  this.showVideoModal = true;
}

closeVideoModal() {
  this.showVideoModal = false;
  this.currentVideoUrl = null;
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
      
      const url = URL.createObjectURL(file);
      this.previewVideo = url;
    }
  }

  openEditModal(lesson: ILesson) {
    this.currentLessonId = lesson.id!;

    this.lessonForm.patchValue({
      title:       lesson.title,
      description: lesson.description || '',
      order:       lesson.order,
      courseId:    lesson.courseId
    });

    
    this.currentImageUrl = lesson.imageUrl || null;
    this.currentVideoUrl = lesson.videoUrl || null;

   
    this.previewImage = lesson.imageUrl
      ? 'https://itkalemsign.runasp.net' + lesson.imageUrl
      : null;

    this.previewVideo = lesson.videoUrl
      ? 'https://itkalemsign.runasp.net' + lesson.videoUrl
      : null;

    
    this.selectedImageFile = null;
    this.selectedVideoFile = null;
    this.lessonForm.get('image')?.setValue(null);
    this.lessonForm.get('video')?.setValue(null);

    this.errorMessage = null;
    this.showModal = true;
  }

  submit() {
    if (!this.currentLessonId || this.lessonForm.invalid) return;

    const formData = new FormData();
    formData.append('title',    this.lessonForm.get('title')?.value || '');
    formData.append('order',    this.lessonForm.get('order')?.value?.toString() || '0');
    formData.append('courseId', this.lessonForm.get('courseId')?.value || '');

    const desc = this.lessonForm.get('description')?.value;
    if (desc) formData.append('description', desc);

    if (this.selectedImageFile) formData.append('image', this.selectedImageFile);
    if (this.selectedVideoFile) formData.append('video', this.selectedVideoFile);

    this._lessonS.updateLesson(this.currentLessonId, formData).subscribe({
      next: (res: any) => {
        const current = this.lessonsSubject.getValue();
        if (current?.data) {
          const updatedData = current.data.map((l: ILesson) => {
            if (l.id === this.currentLessonId) {
              return {
                ...l,
                title:       res.data?.title       ?? this.lessonForm.get('title')?.value,
                description: res.data?.description ?? this.lessonForm.get('description')?.value,
                order:       res.data?.order       ?? this.lessonForm.get('order')?.value,
                courseId:    res.data?.courseId    ?? this.lessonForm.get('courseId')?.value,
                imageUrl:    res.data?.imageUrl    || this.currentImageUrl,
                videoUrl:    res.data?.videoUrl    || this.currentVideoUrl
              };
            }
            return l;
          });
          this.lessonsSubject.next({ ...current, data: updatedData });
        }
        this.resetForm();
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Something went wrong!';
        console.log(err);
      }
    });
  }

  deleteLesson(id: string) {
    if (!confirm('Are you sure you want to delete this lesson?')) return;

    this._lessonS.deleteLesson(id).subscribe({
      next: () => {
        const current = this.lessonsSubject.getValue();
        if (current?.data) {
          const updatedData = current.data.filter((l: ILesson) => l.id !== id);
          this.lessonsSubject.next({ ...current, data: updatedData });
        }
      },
      error: err => console.log(err)
    });
  }

  resetForm() {
    this.lessonForm.reset();
    this.selectedImageFile = null;
    this.selectedVideoFile = null;
    this.currentLessonId = null;
    this.currentImageUrl = null;
    this.currentVideoUrl = null;
    this.showModal = false;
    this.previewImage = null;
    this.previewVideo = null;
    this.errorMessage = null;
  }
}