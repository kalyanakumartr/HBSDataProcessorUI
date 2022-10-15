import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddSubcountryComponent } from './add-subcountry/add-subcountry.component';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectManagementComponent } from './project-management.component';
import { ProjectRoadtypeComponent } from './project-roadtype/project-roadtype.component';
import { ProjectSubcountryListComponent } from './project-subcountry-list/project-subcountry-list.component';
import { ProjectTaskListComponent } from './project-task-list/project-task-list.component';
import { ProjectTemplateComponent } from './project-template/project-template.component';
import { RoadtypeCreateComponent } from './roadtype-create/roadtype-create.component';


const routes: Routes = [
  {
    path: '',
    component: ProjectManagementComponent,
    children: [
      {
        path: 'project-list',
        component: ProjectListComponent,
      },
      {
        path: 'project-create',
        component: ProjectCreateComponent,
      },
      {
        path: 'project-road-type-list',
        component: ProjectRoadtypeComponent,
      },
      {
        path: 'road-type',
        component: RoadtypeCreateComponent,
      },
      {
        path: 'project-subcountry-List',
        component: ProjectSubcountryListComponent,
      },
      {
        path: 'subcountry-create',
        component: AddSubcountryComponent,
      },
      {
        path: 'project-task-List',
        component: ProjectTaskListComponent,
      },
      {
        path: 'project-template',
        component: ProjectTemplateComponent,
      },
      { path: '', redirectTo: 'project-list', pathMatch: 'full' },
      { path: '**', redirectTo: 'project-list', pathMatch: 'full' },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectManagementRoutingModule {

 }
