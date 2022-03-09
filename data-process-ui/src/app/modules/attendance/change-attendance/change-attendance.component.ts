import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AttendanceService } from '../../auth/_services/attendance.service';
import { TimeSheetApprovalService } from '../../auth/_services/timesheetapproval.service';
import { AttendanceModel } from '../modal/attendance.model';

@Component({
  selector: 'app-change-attendance',
  templateUrl: './change-attendance.component.html',
  styleUrls: ['./change-attendance.component.scss']
})
export class ChangeAttendanceComponent implements OnInit {
  @Input() symbol: string;
  @Input() workMode: string;
  @Input() userName: string;
  @Input() approveDate: string;
  attendance:string;

  symbolArray:string[] =['P12WFO','P8WFO','P12WFH','P8WFH'];
  empId:string;
  formatedDate:string;
  markAttendanceModel:AttendanceModel;
  constructor(private snackBar: MatSnackBar,public timeSheetService: TimeSheetApprovalService,
    public attendanceService: AttendanceService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
   this.empId = this.userName.slice(this.userName.indexOf("(")+1,this.userName.lastIndexOf(")"));
   this.attendance= this.symbol.indexOf('P')>=0?this.symbol+"-"+this.workMode:'A';
    this.formatedDate =this.changeDate(this.approveDate)
    //alert(this.symbol.indexOf('P')+"----"+this.symbol+"---"+this.workMode+"----"+this.approveDate+"-----"+this.empId+"----"+ this.attendance +"------"+this.formatedDate);
  }
  markAttendanceOnBehalf(symbol, mode){
    if(symbol == 'A'){
      symbol='Absent';
      mode='None';
    }
    this.attendanceService.markAttendanceOnBehalf(symbol,mode, this.formatedDate,this.empId).pipe(
      tap((res: any) => {
        this.modal.dismiss();
        this.timeSheetService.filterData("");

        console.log("timesheetApprovalReject", res);
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();
  }

  save(){
    if(this.attendance.indexOf("-")>=0){
      var att =this.attendance.split("-");
      this.markAttendanceOnBehalf(att[0],att[1]);
    }else{
      this.markAttendanceOnBehalf(this.attendance,"");
    }
  }
  changeDate(date){
    date = date.replace("-Jan-","/01/").replace("-Feb-","/02/").replace("-Mar-","/03/").replace("-Apr-","/04/").replace("-May-","/06/").replace("-Jun-","/06/").replace("-Jul-","/07/").replace("-Aug-","/08/").replace("-Sep-","/09/").replace("-Oct-","/10/").replace("-Nov-","/11/").replace("-Dec-","/12/");
    date =date.slice(0, 10);
     return date.split("-").reverse().join("/");
  }
  selectedAttendance(value){
    //alert(this.attendance+"---"+value);

  }
}
