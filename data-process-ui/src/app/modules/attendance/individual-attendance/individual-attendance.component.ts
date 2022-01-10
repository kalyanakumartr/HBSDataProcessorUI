import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AttendanceService } from '../../auth/_services/attendance.service';
import { TimeTrackerComponent } from '../../time-tracker/time-tracker/time-tracker.component';
import { Attendance } from '../modal/attendance.model';

@Component({
  selector: 'app-individual-attendance',
  templateUrl: './individual-attendance.component.html',
  styleUrls: ['./individual-attendance.component.scss']
})
export class IndividualAttendanceComponent implements OnInit {
  attendanceList:Attendance[];
  constructor(
    public modalService: NgbModal,
    private snackBar: MatSnackBar,
    private _router: Router,
    public attendanceService: AttendanceService) { }

  ngOnInit(): void {
  }
  private getData(value:string) {
    this.attendanceService.getMonthAttendance().pipe(
      tap((res: any) => {
        this.attendanceList = res;
        console.log("UserAssets List", this.attendanceList);
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();
  }
  addTimeSheet(date){
    const modalRef = this.modalService.open(TimeTrackerComponent, { size: 'lg', animation :true });
    modalRef.componentInstance.date = date;

  }
}
