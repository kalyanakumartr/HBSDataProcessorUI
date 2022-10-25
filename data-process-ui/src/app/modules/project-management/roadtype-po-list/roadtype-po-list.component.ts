import { ProjectService } from '../../auth/_services/project.services';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaginatorState } from 'src/app/_metronic/shared/crud-table';
import { ItItemsModel } from '../../auth/_models/it-items.model';
import { RoadtypeService } from '../../auth/_services/roadtype.services';
import { RoadtypeCreateComponent } from '../roadtype-create/roadtype-create.component';

@Component({
  selector: 'app-roadtype-po-list',
  templateUrl: './roadtype-po-list.component.html',
  styleUrls: ['./roadtype-po-list.component.scss']
})
export class RoadtypePoListComponent implements OnInit {
  paginator: PaginatorState;
  isLoading: boolean;


  constructor(private fb: FormBuilder,
    private modalService: NgbModal,
    public roadTypeService: RoadtypeService,
    public projectService: ProjectService
    ) { }
  @Input() projectId: string;
  @Input() roadId: string;
  @Input() clientName: string;
  displayedColumns = ['clientName','projectName', 'poNumber','poDate','poApprovedLimit'];
  dataSource = new MatTableDataSource<ItItemsModel>();


  ngOnInit(): void {
  }
  delete(id:any){

  }
 // createPO(){

  //}
  close(){
    this.modalService.dismissAll();
  }
  createPO(){
    const modalRef = this.modalService.open(RoadtypeCreateComponent, {
      size: 'xl',
    });
  modalRef.componentInstance.projectId = this.projectId;
    modalRef.componentInstance.roadId = this.roadId;
    modalRef.componentInstance.clientName = this.clientName;
  }

   // pagination
   paginate(paginator: PaginatorState) {
    this.projectService.patchState({ paginator }, '/podetail');
  }


 /* addPO(){
    const modalRef = this.modalService.open(RoadtypeCreateComponent, {
      size: 'xl',
    });

  }
*/
}
