import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AttendanceService } from '../auth/_services/attendance.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {

  constructor(private snackBar: MatSnackBar,
    public attendanceService: AttendanceService,) { }

  ngOnInit(): void {
    this.attendanceService.getMarkedAttendance();
  }

}
