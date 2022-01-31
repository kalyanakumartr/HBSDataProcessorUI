import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AttendanceService } from '../../auth/_services/attendance.service';
import { AttendanceModel } from '../modal/attendance.model';

@Component({
  selector: 'app-mark-attendance',
  templateUrl: './mark-attendance.component.html',
  styleUrls: ['./mark-attendance.component.scss']
})
export class MarkAttendanceComponent implements OnInit {
  symbolArray:string[] =['P12WFO','P8WFO','P12WFH','P8WFH'];
  markAttendanceModel:AttendanceModel;
  constructor(private snackBar: MatSnackBar,
    public attendanceService: AttendanceService) { }

  ngOnInit(): void {
    this.getMarkedAttendance();
  }
  markAttendance(symbol, mode){

      for(var sym of this.symbolArray){
        (<HTMLInputElement>document.getElementById(sym)).classList.remove('mat-accent');
        (<HTMLInputElement>document.getElementById(sym)).classList.add('mat-primary');
      }
    (<HTMLInputElement>document.getElementById(symbol+mode)).classList.remove('mat-primary');
    (<HTMLInputElement>document.getElementById(symbol+mode)).classList.add('mat-accent');
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var currentDate = dd + '/' + mm + '/' + yyyy;
    this.attendanceService.markAttendance(symbol,mode, currentDate).subscribe();

  }
  getMarkedAttendance(){

    this.attendanceService.getMarkedAttendance().pipe(
      tap((res: any) => {
        this.markAttendanceModel = res;

        for(var sym of this.symbolArray){
          if(sym ===this.markAttendanceModel.symbol+this.markAttendanceModel.mode){
            console.log(sym,"-------------",this.markAttendanceModel.symbol+this.markAttendanceModel.mode);
            (<HTMLInputElement>document.getElementById(sym)).classList.remove('mat-primary');
            (<HTMLInputElement>document.getElementById(sym)).classList.add('mat-accent');
          }
        }
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();
  }
}
