
import { Component ,OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { DictionaryService } from '../../core/services/dictionary-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adddictionary',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
 templateUrl: './add-dictionary.html',
  styleUrl: './add-dictionary.css',
})
export class Adddictionary  {



  wordForm = new FormGroup({
    word:      new FormControl('', Validators.required),
    category:  new FormControl('', Validators.required),
    thumbnail: new FormControl(null, Validators.required),
    video:     new FormControl(null, Validators.required)
  });

  selectedThumbnailFile: File | null = null;
  selectedVideoFile: File | null = null;
  previewThumbnail: string | null = null;
  previewVideo: string | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;

 
  constructor(
    private _dictS: DictionaryService,
    
  ) {}

 
  onThumbnailSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedThumbnailFile = file;
      this.wordForm.get('thumbnail')?.setValue(file);
      const reader = new FileReader();
      reader.onload = () => { this.previewThumbnail = reader.result as string; };
      reader.readAsDataURL(file);
    }
  }

  onVideoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedVideoFile = file;
      this.wordForm.get('video')?.setValue(file);
      this.previewVideo = URL.createObjectURL(file);
    }
  }

  submit() {
    if (this.wordForm.invalid) return;

    this.successMessage = null;
    this.errorMessage   = null;

    const formData = new FormData();
    formData.append('word',     this.wordForm.get('word')?.value     || '');
    formData.append('category', this.wordForm.get('category')?.value || '');

    if (this.selectedThumbnailFile) formData.append('thumbnail', this.selectedThumbnailFile);
    if (this.selectedVideoFile)     formData.append('video',     this.selectedVideoFile);

    formData.forEach((value, key) => console.log(key, ':', value));

    this._dictS.createWord(formData).subscribe({
      next: (res) => {
        console.log('Word Created:', res);
        this.successMessage = '✓ Word added successfully!';
        this.wordForm.reset();
        this.selectedThumbnailFile = null;
        this.selectedVideoFile     = null;
        this.previewThumbnail      = null;
        this.previewVideo          = null;
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        console.log('Full error:', err.error);
        this.errorMessage = err.error?.message || err.error?.error || JSON.stringify(err.error);
        setTimeout(() => this.errorMessage = null, 3000);
      }
    });
  }
}

