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
import { AddSubcountryComponent } from '../add-subcountry/add-subcountry.component';
import { ProjectAssignSubcountryComponent } from '../project-assign-subcountry/project-assign-subcountry.component';


@Component({
  selector: 'app-project-subcountry-list',
  templateUrl: './project-subcountry-list.component.html',
  styleUrls: ['./project-subcountry-list.component.scss']
})
export class ProjectSubcountryListComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator:MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
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
  private subCountryList: Array<SubCountry> =[];
  displayedColumns = [ 'countryName','priority','status'];
  dataSource = new MatTableDataSource<SubCountry>();
  constructor(private modalService:NgbModal,public projectService: ProjectService){
    this.projectList=[];
    this.divisionList=[];
    this.isClearFilter=false;
    this.showDivision=true;
    this.showDepartment=true;

  }
  ngOnInit(): void {
    if(this.showDivision){
      this.getDepartment();
      this.division="0: 0";
      this.department="0: 0";
    }
    this.project="0: 0";

  }
  subCountry()
  {
      const modalRef = this.modalService.open(AddSubcountryComponent, { size: 'xl' });
  }
  projectAssignSubcountry(){
    if(this.project != "0: 0"){
      const modalRef = this.modalService.open(ProjectAssignSubcountryComponent, { size: 'xl' });
      modalRef.componentInstance.projectId = this.project;
    }else{
      alert("Please Select the Project");
    }
  }


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
      this.getSubCountryList();
    }
  }

  getSubCountryList(){
    this.projectService.getProjectSubCountryList(this.project).pipe(
      tap((res: Array<SubCountry>) => {
        //this.subCountryList = res;
        this.dataSource = new MatTableDataSource(res);
        //this.useSubCountry();
        console.log("subCountryList", this.dataSource)
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();
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

    this.projectService.exportExcel("/exportToExcelSubCountryReport","Report").subscribe(
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
