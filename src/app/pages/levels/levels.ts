
import { Component, OnInit } from '@angular/core';
import { Levelservice } from '../../core/services/levelservice';
import { Ilevel } from '../../core/Model/levels.model';
import { environment } from '../../Environment/environment';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-levels',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './levels.html',
  styleUrl: './levels.css',
})
export class Levels implements OnInit {

  
  private levelsSubject = new BehaviorSubject<any>(null);
  levels$ = this.levelsSubject.asObservable();

  staticUrl = environment.URLuploade;

  levelForm!: FormGroup;
  selectedFile: File | null = null;
  currentLevelId: string | null = null;
  showModal = false;
  previewImage: string | null = null;

  
  private currentImageUrl: string | null = null;

  constructor(private _levelS: Levelservice) {
    this.levelForm = new FormGroup({
      name: new FormControl('', Validators.required),
      order: new FormControl('', Validators.required),
      image: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.getLevels();
  }

  getLevels() {
    this._levelS.getLevels().subscribe({
      next: (res: any) => {
       
        this.levelsSubject.next(res);
      },
      error: (err) => console.log(err)
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.levelForm.get('image')?.setValue(file);

      const reader = new FileReader();
      reader.onload = () => {
     
        this.previewImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  openEditModal(level: Ilevel) {
    this.currentLevelId = level.id!;

    this.levelForm.patchValue({
      name: level.name,
      order: level.order
    });

    this.currentImageUrl = level.imageUrl || null;

   
    this.previewImage = level.imageUrl
      ? 'https://itkalemsign.runasp.net' + level.imageUrl
      : null;

    
    this.selectedFile = null;
    this.levelForm.get('image')?.setValue(null);

    this.showModal = true;
  }

  submit() {
    if (!this.currentLevelId || this.levelForm.invalid) return;

    const formData = new FormData();
    formData.append('name', this.levelForm.get('name')?.value || '');
    formData.append('order', this.levelForm.get('order')?.value?.toString() || '0');

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this._levelS.updateLevel(this.currentLevelId, formData).subscribe({
      next: (res: any) => {
       
        const current = this.levelsSubject.getValue();
        if (current?.data) {
          const updatedData = current.data.map((l: Ilevel) => {
            if (l.id === this.currentLevelId) {
              return {
                ...l,
                name: res.data?.name ?? this.levelForm.get('name')?.value,
                order: res.data?.order ?? this.levelForm.get('order')?.value,
                imageUrl: res.data?.imageUrl || this.currentImageUrl
              };
            }
            return l;
          });
          this.levelsSubject.next({ ...current, data: updatedData });
        }
        this.resetForm();
      },
      error: err => console.log(err)
    });
  }

  deleteLevel(id: string) {
    if (!confirm("Are you sure you want to delete this level?")) return;

    this._levelS.deleteLevel(id).subscribe({
      next: () => {
       
        const current = this.levelsSubject.getValue();
        if (current?.data) {
          const updatedData = current.data.filter((l: Ilevel) => l.id !== id);
          this.levelsSubject.next({ ...current, data: updatedData });
        }
      },
      error: err => console.log(err)
    });
  }

  resetForm() {
    this.levelForm.reset();
    this.selectedFile = null;
    this.currentLevelId = null;
    this.currentImageUrl = null;
    this.showModal = false;
    this.previewImage = null;
  }
}