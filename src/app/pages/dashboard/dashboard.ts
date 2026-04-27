
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/authService';
import { Levels } from '../levels/levels';
import { Categories } from '../categories/categories';
import { Courses } from '../courses/courses';
import { Lessons } from '../lessons/lessons';
import { Addlevel } from '../addlevel/addlevel';
import { Addcategory } from '../add-category/add-category';
import { Addcourse } from '../add-courses/add-courses';
import { Addlesson } from '../add-lessons/add-lessons';
import { Dictionary } from '../dictionary/dictionary';
import { Adddictionary } from '../add-dictionary/add-dictionary';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    Levels, Categories, Courses, Lessons,
    Addlevel, Addcategory, Addcourse, Addlesson,
    Dictionary, Adddictionary
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  activeView: string | null = null;
  isDark = true;

  constructor(private _auth: AuthService) {
    const saved = localStorage.getItem('theme') || 'dark';
    this.isDark = saved === 'dark';
    this.applyTheme();
  }

  setView(view: string) {
    this.activeView = this.activeView === view ? null : view;
  }


  logout() {
    this._auth.logout();
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme() {
    if (this.isDark) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }
}