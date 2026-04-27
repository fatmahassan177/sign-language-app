
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Levelservice } from '../../core/services/levelservice';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addlevel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './addlevel.html',
  styleUrl: './addlevel.css',
})
export class Addlevel {

  levelForm = new FormGroup({
    name:  new FormControl('', Validators.required),
    order: new FormControl('', Validators.required),
    image: new FormControl(null, Validators.required)
  });

  selectedFile: File | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private _levelS: Levelservice) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.levelForm.get('image')?.setValue(file);
    }
  }

  submit() {
    if (this.levelForm.invalid) return;

    this.successMessage = null;
    this.errorMessage   = null;

    const formData = new FormData();
    formData.append('name',  this.levelForm.get('name')?.value  || '');
    formData.append('order', this.levelForm.get('order')?.value?.toString() || '0');
    if (this.selectedFile) formData.append('image', this.selectedFile);

    this._levelS.createLevel(formData).subscribe({
      next: (res) => {
        console.log('Level Created', res);
        this.successMessage = '✓ Level added successfully!';
        this.levelForm.reset();
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