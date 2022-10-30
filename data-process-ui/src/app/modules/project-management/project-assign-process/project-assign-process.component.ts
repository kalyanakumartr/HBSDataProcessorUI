
import { Component, Input, IterableDiffers, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DualListComponent } from 'angular-dual-listbox';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ProjectService } from '../../auth/_services/project.services';
import { Process } from '../../time-tracker/modal/process.model';


@Component({
  selector: 'app-project-assign-process',
  templateUrl: './project-assign-process.component.html',
  styleUrls: ['./project-assign-process.component.scss']
})
export class ProjectAssignProcessComponent implements OnInit {
  @Input() projectId: string;
  tab = 1;
  keepSorted = true;
  key: string;
  display: string;
  filter = true;
  source: Array<Process>=[];
  confirmed: Array<Process>=[];
  userAdd = '';
  disabled = false;

  sourceLeft = true;
  format: any = DualListComponent.DEFAULT_FORMAT;

  private sourceProcess: Array<Process>=[];

  private confirmedProcess: Array<Process> =[];

  constructor( private projectService: ProjectService,
    private snackBar: MatSnackBar,
    public modal: NgbActiveModal)
    {

     }

     save(){
      console.log("Save confirmedSubProcess", this.confirmed);
      var selectedSubProcess = [];
      this.confirmed.forEach(el=>{
        selectedSubProcess.push(el.process);
      })
      const sbCreate = this.projectService.assignProcessToProject(selectedSubProcess,this.projectId, "/mapProcessProject").pipe(
        tap(() => {
           this.modal.close();
         }),
         catchError((errorMessage) => {
           this.modal.dismiss(errorMessage);
           return of(errorMessage);
         }),
       ).subscribe(res =>this.openSnackBar(res.messageCode?"SubProcess mapped Successfully":res,"!!"));

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
  private useProcess() {
    this.key = 'process';
    this.display = 'processName';
    this.keepSorted = true;
    this.source = this.sourceProcess
    this.confirmed = this.confirmedProcess==undefined?[]:this.confirmedProcess;
}
doReset() {
  this.projectService.getProcessList("").pipe(
    tap((res: Array<Process>) => {
      this.sourceProcess = res;
      console.log("ProcessList", this.sourceProcess)
    }),
    catchError((err) => {
      console.log(err);
      return of({
        items: []
      });
    })).subscribe();

    this.projectService.getProcessList(this.projectId).pipe(
      tap((res: Array<Process>) => {
        this.confirmedProcess = res;
        this.useProcess();
        console.log("confirmedProcess", this.confirmedProcess)
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();
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

