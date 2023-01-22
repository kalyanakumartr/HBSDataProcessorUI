import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DailyLogService } from '../../auth/_services/dailylog.services';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  selector: 'app-change-overtime',
  templateUrl: './change-overtime.component.html',
  styleUrls: ['./change-overtime.component.scss']
})
export class ChangeOvertimeComponent implements OnInit {
  @Input() timesheetId;
  @Input() approvedOTHours;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  overTimeHours:string;
  constructor(public modal: NgbActiveModal,
    private dailyLogService: DailyLogService) {

    }


  ngOnInit(): void {
   this.overTimeHours=this.approvedOTHours;
  }
  update(){
    this.dailyLogService.updateOtHours(this.timesheetId,this.overTimeHours).pipe(
    tap((res: any) => {
      console.log("res",res);

      this.passBack();
      this.modal.dismiss();
      this.dailyLogService.filterData("");
      console.log("updateOtHours", res);
    }),
    catchError((err) => {
      console.log("Err",err.error.text);

      if(err.error.text == "Duration should be less than or equal to the raised Over Time Hours."){
        alert(err.error.text);
        return;
      }
      if(err.error.text == "OT Hours Updated. Please Approve Timesheet for locking OT Hours."){
        this.passBack();
        this.modal.dismiss();
        this.dailyLogService.filterData("");
        return;
      }
      return of({
        items: []
      });
    })).subscribe();
  }
  passBack() {
    this.passEntry.emit(this.overTimeHours);
    }
  }
