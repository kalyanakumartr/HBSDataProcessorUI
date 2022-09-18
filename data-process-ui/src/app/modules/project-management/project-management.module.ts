import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectManagementRoutingModule } from './project-management-routing.module';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { GeneralModule } from 'src/app/_metronic/partials/content/general/general.module';
import { ProjectManagementComponent } from './project-management.component';
import { RoadtypeCreateComponent } from './roadtype-create/roadtype-create.component';
import { AddSubcountryComponent } from './add-subcountry/add-subcountry.component';
import { ProjectTemplateComponent } from './project-template/project-template.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectRoadtypeComponent } from './project-roadtype/project-roadtype.component';
import { ProjectSubcountryListComponent } from './project-subcountry-list/project-subcountry-list.component';

@NgModule({
  declarations: [ProjectCreateComponent, ProjectManagementComponent, RoadtypeCreateComponent, AddSubcountryComponent, ProjectTemplateComponent, ProjectListComponent, ProjectRoadtypeComponent, ProjectSubcountryListComponent],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,ProjectManagementRoutingModule,NgbModalModule, MatSnackBarModule, MatButtonModule,MatIconModule,GeneralModule, NgbDatepickerModule
  ]

})
export class ProjectManagementModule { }
