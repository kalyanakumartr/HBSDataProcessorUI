import { Component, OnInit } from '@angular/core';
import { RoadtypeCreateComponent } from '../roadtype-create/roadtype-create.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../../auth/_services/user.service';
@Component({
  selector: 'app-project-roadtype',
  templateUrl: './project-roadtype.component.html',
  styleUrls: ['./project-roadtype.component.scss']
})
export class ProjectRoadtypeComponent implements OnInit {
  userService: any;


  constructor(private modalService:NgbModal) { }

  ngOnInit(): void {
  }

  roadType()
  {
    const modalRef = this.modalService.open(RoadtypeCreateComponent, { size: 'xl' });
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
