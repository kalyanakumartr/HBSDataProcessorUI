import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AttendanceService } from '../../auth/_services/attendance.service';

@Component({
  selector: 'app-mark-attendance',
  templateUrl: './mark-attendance.component.html',
  styleUrls: ['./mark-attendance.component.scss']
})
export class MarkAttendanceComponent implements OnInit {

  constructor(private snackBar: MatSnackBar,
    public attendanceService: AttendanceService) { }

  ngOnInit(): void {

  }
  markAttendance(){
    this.attendanceService.markAttendance().subscribe();

  }
}
