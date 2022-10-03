import { MatTableModule } from '@angular/material/table';

import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { ProjectManagementComponent } from './project-management.component';
import { AddSubcountryComponent } from './add-subcountry/add-subcountry.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoadtypeCreateComponent } from './roadtype-create/roadtype-create.component';
import { ProjectTemplateComponent } from './project-template/project-template.component';
import { ProjectManagementRoutingModule } from './project-management-routing.module';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectRoadtypeComponent } from './project-roadtype/project-roadtype.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ProjectSubcountryListComponent } from './project-subcountry-list/project-subcountry-list.component';
import { ProjectTaskListComponent } from './project-task-list/project-task-list.component';
import { ProjectTaskCreateComponent } from './project-task-create/project-task-create.component';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { NgModule } from '@angular/core';
@NgModule({
  declarations: [ProjectCreateComponent, ProjectManagementComponent, RoadtypeCreateComponent, AddSubcountryComponent, ProjectTemplateComponent, ProjectListComponent, ProjectRoadtypeComponent, ProjectSubcountryListComponent, ProjectTaskListComponent, ProjectTaskCreateComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule,ProjectManagementRoutingModule,NgbModalModule, CommonModule,   HttpClientModule,
    CRUDTableModule,    FormsModule,    ReactiveFormsModule, InlineSVGModule, NgbDatepickerModule, NgbModalModule, MatSnackBarModule, MatPaginatorModule, MatTableModule,MatSortModule, MatDividerModule, MatExpansionModule,MatDatepickerModule,MatNativeDateModule, MatFormFieldModule,MatInputModule],
  providers: [MatDatepickerModule, MatNativeDateModule],

})
export class ProjectManagementModule { }
