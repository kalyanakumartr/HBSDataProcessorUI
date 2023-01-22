import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, first, tap } from 'rxjs/operators';
import { GroupingState, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { GroupTeamService } from '../../auth/_services/groupteam.services';
import {Team}from '../../auth/_models/team.model';
import { ProjectService } from '../../auth/_services/project.services';
import { Project } from '../../auth/_models/project.model';
import { MatSnackBar } from '@angular/material/snack-bar';
const EMPTY_GROUP: Team = {
  //id: '',

  teamId: '',
  teamName: '',
  groupId: '',
  groupName: '',
  employeeId:'',
  divisionName:'',
  divisionId:'',
  status:true,
  type:'',
  reportingName:'',
  fullName:'',
  reportingTo:'',


}
@Component({
  selector: 'app-group-create',
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.scss']
})
export class GroupCreateComponent implements OnInit {
  @Input() groupId: string;
  @Input() divisionId:string;

  isLoading$;
  formGroup: FormGroup;
  group:Team;
  userList:any[];
  groupList:any[];
  private subscriptions: Subscription[] = [];
  constructor(
    public modal: NgbActiveModal,
    public groupTeamService: GroupTeamService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private projectService:ProjectService,
  )
    {
    this.formGroup = new FormGroup({
      reportingManager: new FormControl(),
      groupName :new FormControl(),
      projectLeaderName:new FormControl(),
      dStatus:new FormControl()
     } );

    }
  ngOnInit(): void {
    this.loadGorupId();
    this.getUserListByRoles();
    this.getGroupList();
  }

  loadGorupId() {
    if (!this.groupId) {
      this.group = EMPTY_GROUP;
      this.loadForm();
    } else {
      console.log("this.id", this.groupId);

      const sb = this.groupTeamService.getGroupTeam(this.groupId).pipe(
        first(),
        catchError((errorMessage) => {
          console.log("errorMessage", errorMessage);
          this.modal.dismiss(errorMessage);
          return of(EMPTY_GROUP);
        })
      ).subscribe((group:Team) => {
        this.group = group;
        console.log(this.group);
        this.loadForm();

        console.log("Check");
      });

    }
    }
loadForm(){
  this.formGroup = this.fb.group({
    reportingManager: [this.group.groupId, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
    groupName: [this.group.teamName, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
    projectLeaderName: [this.group.reportingTo, Validators.compose([ ])],
    dStatus: [this.group.status?"Active":"Inactive", Validators.compose([])],

  });

}
getGroupList(){
this.projectService.getGroupList("NODIVISION").pipe(
  tap((res: any) => {
    this.groupList = res;
    console.log("groupList", this.groupList)
  }),
  catchError((err) => {
    console.log(err);
    return of({
      items: []
    });
  })).subscribe();
}
  getUserListByRoles(){
    var roleShortNames = ["PL"];
    this.projectService
      .getUserListByRoles(this.divisionId,roleShortNames,'')
      .pipe(
        tap((res: any) => {
          this.userList = res;
          console.log('userList', this.userList);
        }),
        catchError((err) => {
          console.log(err);
          return of({
            items: [],
          });
        })
      )
      .subscribe();
  }

  save(){
    var groupObj : any={teamId:'',teamName:'',type:'',status:'',displayOrder:10};
    const formData = this.formGroup.value;
    groupObj.teamId = this.group.teamId!=""?this.group.teamId:null;
    groupObj.teamName = formData.groupName;
    groupObj.type = 'Group';
    groupObj.status = formData.dStatus=="Active"?true:false;
console.log("teamId",this.group.teamId);
var path ='';
  if(this.group.teamId!=""){
    path ="/updateGroupTeam";
  }else{
    path ="/addGroupTeam";
  }
    const sbCreate = this.groupTeamService.updateGroupTeam(groupObj,this.divisionId,formData.projectLeaderName, formData.reportingManager, path).pipe(
      tap(() => {
          this.modal.close();
          this.groupTeamService.filterData("");
        }),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(errorMessage);
        }),
      ).subscribe(res =>this.openSnackBar(res.messageCode?"Update Successful":res,"!!"));
   }
   openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition:"top"
    });
  }
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }

}
