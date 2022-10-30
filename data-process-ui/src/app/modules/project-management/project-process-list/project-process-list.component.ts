import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ProjectService } from '../../auth/_services/project.services';
import { Process } from '../../time-tracker/modal/process.model';
import { ProjectAssignProcessComponent } from '../project-assign-process/project-assign-process.component';
import { ProjectProcessCreateComponent } from '../project-process-create/project-process-create.component';

@Component({
  selector: 'app-project-process-list',
  templateUrl: './project-process-list.component.html',
  styleUrls: ['./project-process-list.component.scss']
})
export class ProjectProcessListComponent implements OnInit {
  department: any;
  divisionList:any[];
  searchGroup: FormGroup;
  departmentList:any[];
  projectList:any[];
  division:any;
  project:any;
  isClearFilter:boolean;
  dataSource = new MatTableDataSource<Process>();
  showDivision:boolean;
  showDepartment:boolean;
  private subProcessList: Array<Process> =[];
  displayedColumns = [ 'processName','billType','status'];


  constructor(
    private modalService:NgbModal,public projectService: ProjectService){
      this.projectList=[];
      this.divisionList=[];
      this.isClearFilter=false;
      this.showDivision=true;
      this.showDepartment=true;}

  ngOnInit(): void {
    if(this.showDivision){
      this.getDepartment();
      this.division="0: 0";
      this.department="0: 0";
    }
    this.project="0: 0";
  }
  taskCreate()
  {
    const modalRef = this.modalService.open(ProjectProcessCreateComponent, { size: 'xl' });
  }
  /* ST getDepartment()*/
  getDepartment()
  {
    this.projectService.getDepartmentList().pipe(
      tap((res: any) => {
        this.departmentList = res;
        console.log("departmentList", this.departmentList)
        this.department="0: 0";

      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();
  }
    /* End getDepartment()*/
/*Set deparnment*/
    setDepartment(value){
      var position =value.split(":")
      if(position.length>1){
        this.department= position[1].toString().trim();
        if(this.department != "0"){
          this.isClearFilter=true;
          this.getDivisionForDepartment();
         // this.deliveryTrackerService.patchState({ departmentId:this.department },"/deliveryCompletedReport");
        }
      }
    }
    setDivision(value){
      var position =value.split(":")
      if(position.length>1){
        this.division= position[1].toString().trim();
        if(this.division != "0"){
          this.getProjectForDivision();
         // this.deliveryTrackerService.patchState({ divisionId:this.division },"/deliveryCompletedReport");
        }
      }
    }
    getProjectForDivision(){
      this.projectList=[];
      this.projectService.getProjectList(this.division).pipe(
        tap((res: any) => {
          this.projectList = res;
          console.log("projectList", this.projectList);
          this.project="0: 0";
        }),
        catchError((err) => {
          console.log(err);
          return of({
            items: []
          });
        })).subscribe();
    }
    /*End set deparnment*/
     /*St  getDivisionForDepartment()*/
    getDivisionForDepartment(){
      this.divisionList=[];
      this.projectService.getDivisionList(this.department).pipe(
        tap((res: any) => {
          this.divisionList = res;
          console.log("divisionList", this.divisionList)
          this.division="0: 0";
        }),
        catchError((err) => {
          console.log(err);
          return of({
            items: []
          });
        })).subscribe();
    }
    setProject(value){
      var position =value.split(":")
      if(position.length>1){
        this.project= position[1].toString().trim();
        this.getSubProcessList();
      }
    }
    getSubProcessList(){
      this.projectService.getProcessList(this.project).pipe(
        tap((res: Array<Process>) => {
          //this.subCountryList = res;
          this.dataSource = new MatTableDataSource(res);
          //this.useSubCountry();
          console.log("subProcessList", this.dataSource)
        }),
        catchError((err) => {
          console.log(err);
          return of({
            items: []
          });
        })).subscribe();
    }

      /*End  getDivisionForDepartment()*/
      projectAssignTask()
  {
    if(this.project != "0: 0"){
      const modalRef = this.modalService.open(ProjectAssignProcessComponent,{ size: 'xl' });
      modalRef.componentInstance.projectId = this.project;
    }else{
      alert("Please Select the Project");
    }
  }
  clearFilter(){

    if(this.isClearFilter){
      if(this.showDivision){
        this.division="0: 0";
        if(this.divisionList.length>0){
          this.divisionList.splice(0, this.divisionList.length);
        }
      }
      if(this.showDepartment){
        if(this.departmentList.length>0){
          this.departmentList.splice(0, this.departmentList.length);
        }
        this.getDepartment();

        this.project="0: 0";
        if(this.projectList.length>0){
          this.projectList.splice(0, this.projectList.length);
        }

      }else{
        this.project="0: 0";
  }
}
  }
}
