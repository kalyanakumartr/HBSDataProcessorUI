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
import { ProjectTemplateComponent } from './project-template/project-template.component';
import { ProjectManagementRoutingModule } from './project-management-routing.module';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { ProjectListComponent } from './project-list/project-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ProjectSubcountryListComponent } from './project-subcountry-list/project-subcountry-list.component';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { NgModule } from '@angular/core';
import { ProjectAssignSubcountryComponent } from './project-assign-subcountry/project-assign-subcountry.component';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { ProjectAssignRoadtypeComponent } from './project-assign-roadtype/project-assign-roadtype.component';
import { RoadtypePoListComponent } from './roadtype-po-list/roadtype-po-list.component';
import { RoadtypePoCreateComponent } from './roadtype-po-create/roadtype-po-create.component';
import { RoadtypeListComponent } from './roadtype-list/roadtype-list.component';
import { GroupListComponent } from './group-list/group-list.component';
import { TeamListComponent } from './team-list/team-list.component';
import { GroupCreateComponent } from './group-create/group-create.component';
import { TeamCreateComponent } from './team-create/team-create.component';
import { AssignTeamGroupComponent } from './assign-team-group/assign-team-group.component';
import { GroupTeamAssignComponent } from './group-team-assign/group-team-assign.component';
import { TeamTeammemberAssignComponent } from './team-teammember-assign/team-teammember-assign.component';
import { ProjectAssignProcessComponent } from './project-assign-process/project-assign-process.component';
import { ProjectProcessCreateComponent } from './project-process-create/project-process-create.component';
import { ProjectProcessListComponent } from './project-process-list/project-process-list.component';
import { CreateWorkflowComponent } from './create-workflow/create-workflow.component';
import { TeamTransferComponent } from './team-transfer/team-transfer.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [ProjectCreateComponent, ProjectManagementComponent, RoadtypePoCreateComponent, AddSubcountryComponent, ProjectTemplateComponent, ProjectListComponent, ProjectSubcountryListComponent, ProjectAssignSubcountryComponent, ProjectAssignRoadtypeComponent, RoadtypePoListComponent,  RoadtypeListComponent, GroupListComponent, TeamListComponent, GroupCreateComponent, TeamCreateComponent, AssignTeamGroupComponent, GroupTeamAssignComponent, TeamTeammemberAssignComponent, ProjectAssignProcessComponent, ProjectProcessCreateComponent, ProjectProcessListComponent, CreateWorkflowComponent, TeamTransferComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule,ProjectManagementRoutingModule,NgbModalModule, CommonModule,   HttpClientModule,
    CRUDTableModule,    FormsModule,    ReactiveFormsModule, InlineSVGModule, NgbDatepickerModule, NgbModalModule, MatSnackBarModule, MatPaginatorModule, MatTableModule,MatSortModule, MatDividerModule, MatExpansionModule,MatDatepickerModule,MatNativeDateModule, MatFormFieldModule,MatInputModule,AngularDualListBoxModule, NgMultiSelectDropDownModule],
  providers: [MatDatepickerModule, MatNativeDateModule],

})
export class ProjectManagementModule { }
