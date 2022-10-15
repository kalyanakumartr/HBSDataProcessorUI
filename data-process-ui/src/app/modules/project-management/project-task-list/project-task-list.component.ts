import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectTaskCreateComponent } from '../project-task-create/project-task-create.component';

@Component({
  selector: 'app-project-task-list',
  templateUrl: './project-task-list.component.html',
  styleUrls: ['./project-task-list.component.scss']
})
export class ProjectTaskListComponent implements OnInit {

  constructor(private modalService:NgbModal) { }

  ngOnInit(): void {
  }
  taskCreate()
  {
    const modalRef = this.modalService.open(ProjectTaskCreateComponent, { size: 'xl' });
  }
}
