import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DualListComponent } from 'angular-dual-listbox';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserModel } from '../../auth';
import { GroupTeamService } from '../../auth/_services/groupteam.services';
import { ProjectService } from '../../auth/_services/project.services';

@Component({
  selector: 'app-team-teammember-assign',
  templateUrl: './team-teammember-assign.component.html',
  styleUrls: ['./team-teammember-assign.component.scss']
})
export class TeamTeammemberAssignComponent implements OnInit {
  @Input() projectId: string;
  tab = 1;
  keepSorted = true;
  key: string;
  display: string;
  filter = true;
  source: Array<UserModel>=[];
  confirmed: Array<UserModel>=[];
  userAdd = '';
  disabled = false;

  sourceLeft = true;
  format: any = DualListComponent.DEFAULT_FORMAT;

  private sourceUsers: Array<UserModel>=[];

  private confirmedUsers: Array<UserModel> =[];

  constructor(
    private projectService: ProjectService,
    private groupTeamService: GroupTeamService,
    private snackBar: MatSnackBar,
    public modal: NgbActiveModal
  ) {

  }

  save(){
    console.log("Save confirmedUsers", this.confirmed);
    var selectedSubCountry = [];
    this.confirmed.forEach(el=>{
      selectedSubCountry.push(el.country);
    })
    const sbCreate = this.projectService.assignSubCountryToProject(selectedSubCountry,this.projectId, "/mapSubCountry").pipe(
      tap(() => {
         this.modal.close();
       }),
       catchError((errorMessage) => {
         this.modal.dismiss(errorMessage);
         return of(errorMessage);
       }),
     ).subscribe(res =>this.openSnackBar(res.messageCode?"SubCountry mapped Successfully":res,"!!"));

  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition:"top"
    });
  }
  ngOnInit(): void {
    this.doReset();
  }

  private useSubCountry() {
    this.key = 'country';
    this.display = 'countryName';
    this.keepSorted = true;
    this.source = this.sourceUsers;
    this.confirmed = this.confirmedUsers==undefined?[]:this.confirmedUsers;
  }
  private setSelectedSubCountry(){
    //this.confirmed = this.confirmedSubCountry;
  }
  doReset() {
   /* this.projectService.getProjectSubCountryList("").pipe(
      tap((res: Array<UserModel>) => {
        this.sourceUsers = res;

        console.log("sourceUsersList", this.sourceUsers)
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();

      this.groupTeamService.getTeamList(this.projectId).pipe(
        tap((res: Array<UserModel>) => {
          this.confirmedUsers = res;
          this.useSubCountry();
          console.log("confirmedUsers", this.confirmedUsers)
        }),
        catchError((err) => {
          console.log(err);
          return of({
            items: []
          });
        })).subscribe();
        */
  }

  filterBtn() {
    return (this.filter ? 'Hide Filter' : 'Show Filter');
  }

  doDisable() {
    this.disabled = !this.disabled;
  }

  disableBtn() {
    return (this.disabled ? 'Enable' : 'Disabled');
  }

  swapDirection() {
    this.sourceLeft = !this.sourceLeft;
    this.format.direction = this.sourceLeft ? DualListComponent.LTR : DualListComponent.RTL;
  }

}
