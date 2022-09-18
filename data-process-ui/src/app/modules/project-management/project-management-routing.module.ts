import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { ProjectManagementComponent } from './project-management.component';


const routes: Routes = [
  {
    path: '',
    component: ProjectManagementComponent,
    children: [
      {
        path: 'projectCreate',
        component: ProjectCreateComponent,
      },

      { path: '', redirectTo: 'projectCreate', pathMatch: 'full' },
      { path: '**', redirectTo: 'projectCreate', pathMatch: 'full' },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectManagementRoutingModule {

 }
