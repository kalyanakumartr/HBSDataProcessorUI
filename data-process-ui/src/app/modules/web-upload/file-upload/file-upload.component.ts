import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ProjectService } from '../../auth/_services/project.services';
import { UsersService } from '../../auth/_services/user.service';
import { WebUploadService } from '../../auth/_services/web-upload.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  isLoading$;
  fileToUpload: File | null = null;
  projectId:any;
  projectSelected:any;
  projectList:any[];
  department:string;
  divisionList:any[];
  division:string;
  formGroup: FormGroup;
  departmentList:any[];
  private subscriptions: Subscription[] = [];
  constructor( private snackBar: MatSnackBar,private usersService: UsersService,private projectService: ProjectService,private uploadService :WebUploadService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.isLoading$ = this.usersService.isLoading$;
        this.projectService.getDepartmentList().pipe(
          tap((res: any) => {
            this.departmentList = res;
            console.log("departmentList", this.departmentList);
            this.loadForm();
          }),
          catchError((err) => {
            console.log(err);
            return of({
              items: []
            });
          })).subscribe();
  }
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
}
loadForm() {
  this.formGroup = this.fb.group({

    department: ['', Validators.compose([Validators.required])],
    division: ['', Validators.compose([Validators.required])],
    projectId: ['', Validators.compose([Validators.required])],

  });
  this.department='';
  this.division='';
  this.projectId='';
}
upload() {

  const sbUpdate = this.uploadService.uploadFile(this.projectSelected, this.fileToUpload).pipe(
    tap(() => {



    }),
    catchError((errorMessage) => {
      this.openSnackBar(errorMessage.error,"X");
      return of();
    }),
  ).subscribe(res =>this.openSnackBar(res.messageCode?"Web Upload file Uploaded Successful":"File Uploaded "+res +". Further details check Uploaded Files Summary","!!"));

}
openSnackBar(message: string, action: string) {
  this.snackBar.open(message, action, {
    duration: 4000,
    verticalPosition:"top"
  });
}
clear(){

}
ngOnDestroy(): void {
  this.subscriptions.forEach(sb => sb.unsubscribe());
}

// helpers for View
isControlValid(controlName: string): boolean {
  const control = this.formGroup.controls[controlName];
  return control.valid && (control.dirty || control.touched);
}

isControlInvalid(controlName: string): boolean {
  const control = this.formGroup.controls[controlName];
  return control.invalid && (control.dirty || control.touched);
}
getProjectOnChange(value){
  this.projectSelected=value;
  //this.projectId=value;
}
setDepartment(value){
  var position =value.split(":")
  if(position.length>1){
    this.department= position[1].toString().trim();
    this.getDivisionForDepartment();
  }
}
setDivision(value){
  var position =value.split(":")
  if(position.length>1){
    this.division= position[1].toString().trim();
    this.getProjectByDivision();
  }
}
getDivisionForDepartment(){
  this.divisionList=[];
  this.projectService.getDivisionList(this.department).pipe(
    tap((res: any) => {
      this.divisionList = res;
      console.log("divisionList", this.divisionList)
    }),
    catchError((err) => {
      console.log(err);
      return of({
        items: []
      });
    })).subscribe();
}
getProjectByDivision(){
 // var position =value.split(":")
  //var division=position[1].toString().trim();

  this.projectService.getProjectList(this.division).pipe(
    tap((res: any) => {
      this.projectList = res;
      console.log("projectList", this.projectList)
    }),
    catchError((err) => {
      console.log(err);
      return of({
        items: []
      });
    })).subscribe();
}

}
