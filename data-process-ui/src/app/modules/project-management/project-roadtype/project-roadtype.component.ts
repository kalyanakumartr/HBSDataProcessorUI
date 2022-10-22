import { Component,  OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SubCountry } from '../../auth/_models/sub-country.model';
import { ProjectService } from '../../auth/_services/project.services';
import { ProjectAssignRoadtypeComponent } from '../project-assign-roadtype/project-assign-roadtype.component';
import { RoadtypeCreateComponent } from '../roadtype-create/roadtype-create.component';

@Component({
  selector: 'app-project-roadtype',
  templateUrl: './project-roadtype.component.html',
  styleUrls: ['./project-roadtype.component.scss']
})
export class ProjectRoadtypeComponent implements OnInit {
  userService: any;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  departmentList:any[];
  department:any;
  divisionList:any[];
  division:any;
  projectList:any[];
  project:any;
  departmentName:string;
  divisionName:string;
  showDivision:boolean;
  showDepartment:boolean;
  isClearFilter:boolean;

  displayedColumns = [ 'clientName','projectName',''];

  constructor(private modalService:NgbModal,public projectService: ProjectService){
    this.projectList=[];
    this.divisionList=[];
    this.isClearFilter=false;
    this.showDivision=true;
    this.showDepartment=true;
  }
  ngOnInit(): void {if(this.showDivision){
    this.getDepartment();
    this.division="0: 0";
    this.department="0: 0";
  }
  this.project="0: 0";

  }

  create() {
    if(this.division){
      this.projectroadtype();
    }else{
      alert("Please Select Divison");
    }
  }



  projectroadtype()
  {
  const modalRef = this.modalService.open(ProjectAssignRoadtypeComponent, { size: 'xl' });
  }
  roadType()
  {
    const modalRef = this.modalService.open(RoadtypeCreateComponent, { size: 'xl' });
  }
ok
  getDepartment(){
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

  setProject(value){
    var position =value.split(":")
    if(position.length>1){
      this.project= position[1].toString().trim();

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

          (<HTMLInputElement>document.getElementById("searchText")).value="";

          if(this.showDivision){
            this.department="0: 0";
          }
        }else{
          (<HTMLInputElement>document.getElementById("searchText")).value="";
        }
      }


      exportExcel(){
        (<HTMLInputElement>document.getElementById("exportExcel")).disabled=true;
        (<HTMLInputElement>document.getElementById("divSpinnerId")).hidden = false;
        this.projectService.exportExcel("/exportToExcelSubCountryList","Project").subscribe(
          responseObj => {
            console.log("Project success", responseObj);
            var downloadURL = window.URL.createObjectURL(responseObj);
            var link = document.createElement('a');
            link.href = downloadURL;
            link.download = "projectSubCountryList.xlsx";
            link.click();
            (<HTMLInputElement>document.getElementById("exportExcel")).disabled=false;
            (<HTMLInputElement>document.getElementById("divSpinnerId")).hidden = true;
          },
          error => {
            console.log("report error", error);
            (<HTMLInputElement>document.getElementById("exportExcel")).disabled=false;
            (<HTMLInputElement>document.getElementById("divSpinnerId")).hidden = true;

          }
        );

      }

    }
