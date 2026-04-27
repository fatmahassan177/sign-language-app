
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/authService';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  loading = false;
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])
  });


onSubmit() {

  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.loading = true;
  this.errorMessage = '';

  this.auth.login(this.loginForm.value as any).subscribe({
    next: (res) => {

      
      console.log('Login Response:', res);

      const user = this.auth.getUserFromToken();
      console.log('Decoded User from Token:', user);

    
      setTimeout(() => {

        if (user?.role === 'admin') {
        this.router.navigate(['/dashboard']); 
        } else {
          this.auth.logout();
          this.errorMessage = 'You are not authorized';
        }

        this.loading = false;

      });  

    },
    error: () => {
      this.errorMessage = 'Invalid email or password';
      this.loading = false;
    }
  });
}
  }

