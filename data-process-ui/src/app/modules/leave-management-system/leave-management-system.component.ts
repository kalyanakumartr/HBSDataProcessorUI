import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { UsersService } from '../auth/_services/user.service';
import { ApplyLeaveComponent } from './apply-leave/apply-leave.component';

@Component({
  selector: 'app-leave-management-system',
  templateUrl: './leave-management-system.component.html',
  styleUrls: ['./leave-management-system.component.scss']
})
export class LeaveManagementSystemComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    private snackBar: MatSnackBar,
    private timeTrackerService: UsersService,
    private fb: FormBuilder,
    ) {

    }

  ngOnInit(): void {
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition:"bottom"
    });
  }
  applyLeave(id: number) {
    const modalRef = this.modalService.open(ApplyLeaveComponent, { size: 'xl' });
    modalRef.componentInstance.id = id;

 }
}

