import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AttendanceService } from '../../auth/_services/attendance.service';
import { MarkAttendanceModel } from '../modal/mark-attendance.model';

@Component({
  selector: 'app-mark-attendance',
  templateUrl: './mark-attendance.component.html',
  styleUrls: ['./mark-attendance.component.scss']
})
export class MarkAttendanceComponent implements OnInit {
  symbolArray:string[] =['Present_12_Hours','Present_8_Hours','Present_4_Hours'];
  markAttendanceModel:MarkAttendanceModel;
  constructor(private snackBar: MatSnackBar,
    public attendanceService: AttendanceService) { }

  ngOnInit(): void {
    this.getMarkedAttendance();
  }
  markAttendance(symbol){

      for(var sym of this.symbolArray){
        (<HTMLInputElement>document.getElementById(sym)).classList.remove('mat-accent');
        (<HTMLInputElement>document.getElementById(sym)).classList.add('mat-primary');
      }
    (<HTMLInputElement>document.getElementById(symbol)).classList.remove('mat-primary');
    (<HTMLInputElement>document.getElementById(symbol)).classList.add('mat-accent');
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var currentDate = dd + '/' + mm + '/' + yyyy;
    this.attendanceService.markAttendance(symbol, currentDate).subscribe();

  }
  getMarkedAttendance(){

    this.attendanceService.getMarkedAttendance().pipe(
      tap((res: any) => {
        this.markAttendanceModel = res;

        for(var sym of this.symbolArray){
          if(sym.indexOf(this.markAttendanceModel.symbol.substring(1,2))>1){
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
