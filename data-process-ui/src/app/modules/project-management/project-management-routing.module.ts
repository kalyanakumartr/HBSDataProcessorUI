import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddSubcountryComponent } from './add-subcountry/add-subcountry.component';
import { AssignTeamGroupComponent } from './assign-team-group/assign-team-group.component';
import { GroupListComponent } from './group-list/group-list.component';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectManagementComponent } from './project-management.component';
import { ProjectProcessListComponent } from './project-process-list/project-process-list.component';
import { ProjectSubcountryListComponent } from './project-subcountry-list/project-subcountry-list.component';
import { ProjectTemplateComponent } from './project-template/project-template.component';
import { RoadtypeListComponent } from './roadtype-list/roadtype-list.component';
import { TeamListComponent } from './team-list/team-list.component';


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

        component: RoadtypeListComponent,
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
        component: ProjectProcessListComponent,
      },
      {
        path: 'project-template',
        component: ProjectTemplateComponent,
      },
      {
        path: 'project-group',
        component: GroupListComponent,
      },
      {
        path: 'project-team',
        component: TeamListComponent,
      },{
        path: 'worklow-queue',
        component: AssignTeamGroupComponent,
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
