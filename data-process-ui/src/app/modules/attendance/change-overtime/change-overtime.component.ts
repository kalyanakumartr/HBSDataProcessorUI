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
    alert(this.overTimeHours);
    this.dailyLogService.updateOtHours(this.timesheetId,this.overTimeHours).pipe(
    tap((res: any) => {
      this.modal.dismiss();
      this.dailyLogService.filterData("");
      //this.dailyLogService.filterData("");
      console.log("updateOtHours", res);
    }),
    catchError((err) => {
      console.log(err);
      return of({
        items: []
      });
    })).subscribe();
  }
  passBack() {
    this.passEntry.emit(this.overTimeHours);
    }
  }
