import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Levels } from './pages/levels/levels';
import { RoleGuard } from './core/gards/role-guard';
import { Addlevel } from './pages/addlevel/addlevel';
import { Categories } from './pages/categories/categories';
import { Addcategory } from './pages/add-category/add-category';
import { Addcourse } from './pages/add-courses/add-courses';
import { Courses } from './pages/courses/courses';
import { Lessons } from './pages/lessons/lessons';
import { Addlesson } from './pages/add-lessons/add-lessons';
import { Dictionary } from './pages/dictionary/dictionary';
import { Adddictionary } from './pages/add-dictionary/add-dictionary';
export const routes: Routes = [
//   { path: 'login', component: Login },

//   {
//     path: 'dashboard',
//     component: Dashboard,
//     children: [
//       { path: 'levels', component: Levels },
//       { path: 'addlevel', component: Addlevel },
//       { path: 'categories', component: Categories },
//       { path: 'addcategories', component: Addcategory },
//       { path: 'courses', component: Courses },
//       { path: 'addcourses', component: Addcourse },
//       { path: 'lessons', component: Lessons },
//       { path: 'addlessons', component: Addlesson }
//     ]
//   },

//   { path: '', redirectTo: '/login', pathMatch: 'full' }
// ];

 { path: 'login', component: Login },

  {
    path: 'dashboard',
    component: Dashboard,
   
    canActivate: [RoleGuard],
    data: { role: 'admin' },
    children: [
      { path: 'levels',        component: Levels },
      { path: 'addlevel',      component: Addlevel },
      { path: 'categories',    component: Categories },
      { path: 'addcategories', component: Addcategory },
      { path: 'courses',       component: Courses },
      { path: 'addcourses',    component: Addcourse },
      { path: 'lessons',       component: Lessons },
      { path: 'addlessons',    component: Addlesson },
      { path: 'dictionary',    component: Dictionary },
{ path: 'adddictionary', component: Adddictionary },
    ]
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' }
];