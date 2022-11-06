import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { GroupingState, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { GroupTeamService } from '../../auth/_services/groupteam.services';
import {Team}from '../../auth/_models/team.model';
import { ProjectService } from '../../auth/_services/project.services';
import { Project } from '../../auth/_models/project.model';
const EMPTY_PROJECT: Team = {
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
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  divisionId:string;
  //group:Group;
    @Input() groupId: string;
  isLoading$;
  searchGroup: FormGroup;
  formGroup: FormGroup;
  group:Team;
  userList:any[];
  groupList:any[];
  private subscriptions: Subscription[] = [];
  constructor(
    public modal: NgbActiveModal,
    public groupTeamService: GroupTeamService,
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
    this.searchForm();
    this.groupTeamService.fetch('/searchGroupTeam');
    console.log('UserList :', this.subscriptions);
    this.grouping = this.groupTeamService.grouping;
    this.paginator = this.groupTeamService.paginator;
    this.sorting = this.groupTeamService.sorting;
    this.getUserListByRoles();
    this.getGroupList();

  }

  loadGorupId() {
    if (!this.groupId) {
      this.group = EMPTY_PROJECT;
      this.loadForm();
    } else {
      console.log("this.id", this.groupId);

      const sb = this.projectService.getProjectById(this.groupId).pipe(
        //first(),
        catchError((errorMessage) => {
          console.log("errorMessage", errorMessage);
          this.modal.dismiss(errorMessage);
          return of(EMPTY_PROJECT);
        })
      ).subscribe((project:Project) => {
     //   this.groupId = project;
       // console.log(this.project);
        this.loadForm();

        console.log("Check");
      });

    }
    }
loadForm(){
  this.formGroup = this.fb.group({
    reportingManager: [this.group.reportingName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
    groupName: [this.group.teamName, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
    projectLeaderName: [this.group.employeeId, Validators.compose([ ])],
    dStatus: [this.group.status, Validators.compose([])],

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

  }
  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
      department: ['0'],
      division: ['0'],
      project: ['0'],
    });
    const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
      .pipe(

        debounceTime(150),
        distinctUntilChanged()
      )
      .subscribe((val) => this.search(val));
    this.subscriptions.push(searchEvent);
  }
  search(searchTerm: string) {
    this.groupTeamService.patchState({ searchTerm }, '/searchGroupTeam');
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
