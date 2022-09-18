import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectService } from '../../auth/_services/project.services';
import { UsersService } from '../../auth/_services/user.service';
import { UserHRModalComponent } from '../../user-management/users/component/user-hr-modal/user-hr-modal.component';
import { ProjectCreateComponent } from '../project-create/project-create.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  projectList:any[];
  constructor(private fb: FormBuilder,
    private modalService: NgbModal, public userService: UsersService, public projectService: ProjectService) {
      this.userService.listen().subscribe((m:any)=>{
        console.log("m -- -- --",m);
        this.filter();
      });
      this.projectList=[];

    }
  ngOnInit(): void {
  }
  filter() {
    const filter = {};
    /*const status = this.filterGroup.get('status').value;
    if (status) {
      filter['status'] = status;
    }

    const type = this.filterGroup.get('type').value;
    if (type) {
      filter['type'] = type;
    }*/
    this.userService.patchState({ filter },"/searchUser");
  }
  addProject() {
    const modalRef = this.modalService.open(ProjectCreateComponent, { size: 'xl' });

 }
 exportExcel(){
  this.userService.exportExcel("/exportToExcelHRRecord","Admin").subscribe(
    responseObj => {
      console.log("report success", responseObj);
      var downloadURL = window.URL.createObjectURL(responseObj);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "HRRecords.xlsx";
      link.click();

    },
    error => {
      console.log("report error", error);


    }
  )
    }
}
