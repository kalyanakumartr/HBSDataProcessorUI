import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItItemsModel } from '../../auth/_models/it-items.model';
import { RoadtypeService } from '../../auth/_services/roadtype.services';
import { RoadtypeCreateComponent } from '../roadtype-create/roadtype-create.component';

@Component({
  selector: 'app-roadtype-po-list',
  templateUrl: './roadtype-po-list.component.html',
  styleUrls: ['./roadtype-po-list.component.scss']
})
export class RoadtypePoListComponent implements OnInit {
  @Input() projectId: string;
  @Input() roadId: string;
  @Input() clientName: string;
  displayedColumns = ['slno', 'assetName','serialNo','brand','givenDate','receivedDate','remarks','Action'];
  dataSource = new MatTableDataSource<ItItemsModel>();
  constructor(private fb: FormBuilder,
    private modalService: NgbModal,
    public roadTypeService: RoadtypeService) { }

  ngOnInit(): void {
  }
  delete(id:any){

  }
  createPO(){

  }
  close(){
    this.modalService.dismissAll();
  }
  addPO(projectId: string, roadId: string, clientName: string){
    const modalRef = this.modalService.open(RoadtypeCreateComponent, {
      size: 'xl',
    });
    modalRef.componentInstance.projectId = projectId;
    modalRef.componentInstance.roadId = roadId;
    modalRef.componentInstance.clientName = clientName;
  }

}
