import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../../auth/_services/user.service';
import { WorkAllocationService } from '../../auth/_services/workallocation.service';

@Component({
  selector: 'app-work-allocation',
  templateUrl: './work-allocation.component.html',
  styleUrls: ['./work-allocation.component.scss']
})
export class WorkAllocationComponent implements OnInit {
  workUnitStatusList: any;
  //displayedColumns = ['queue', 'Ready','Assigned','In Progress','Completed','Reject','Hold','Revoke'];
  displayedColumns = ['queue', 'Ready','Assigned','In Progress','Completed'];
  dataSource = new MatTableDataSource();
  constructor( private modalService: NgbModal, public userService: UsersService, public workAllocationService: WorkAllocationService) { }

  ngOnInit(): void {
    this.getWorkUnitsStatus();
  }
  public getWorkUnitsStatus() {
    console.log('Inside get Queue');
    this.workAllocationService.getWorkUnitStatusList().subscribe((res) => {
      //this.workUnitStatusList = workUnitStatusList.taskDataCountList;
      this.dataSource = new MatTableDataSource(res[0].taskDataCountList);
      console.log('Work Unit Status List', this.dataSource);
    });

  }
}
