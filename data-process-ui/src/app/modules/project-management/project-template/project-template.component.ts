import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Project } from '../../auth/_models/project.model';
import { ProjectService } from '../../auth/_services/project.services';

@Component({
  selector: 'app-project-template',
  templateUrl: './project-template.component.html',
  styleUrls: ['./project-template.component.scss']
})
export class ProjectTemplateComponent implements OnInit {

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
  displayedColumns = [ 'projectName','projectId','templateUploadDate','Action'];
  dataSource = new MatTableDataSource<Project>();
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
  downloadTemplate(projectId)
  {
    alert(projectId);
    this.projectService.exportExcel("/getProjectTemplate/"+projectId,"Project").subscribe(
      responseObj => {
        console.log("Project template download success", responseObj);
        var downloadURL = window.URL.createObjectURL(responseObj);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = projectId +".xlsx";
        link.click();
      },
      error => {
        console.log("Project template download  error", error);


      }
    );

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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


  getProjectList(){
    /*this.projectService.getProjectSubCountryList(this.project).pipe(
      tap((res: Array<Project>) => {
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
      })).subscribe();*/
  }
  getProjectForDivision(){
    this.projectList=[];
    this.projectService.getProjectList(this.division).pipe(
      tap((res: any) => {
        this.dataSource = res;
        console.log("projectList", this.projectList);
        this.project="0: 0";
        setTimeout(() => {
          this.ngAfterViewInit();
        }, 2000);

      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
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


      }else{

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
