import { Component,  OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddSubcountryComponent } from '../add-subcountry/add-subcountry.component';


@Component({
  selector: 'app-project-subcountry-list',
  templateUrl: './project-subcountry-list.component.html',
  styleUrls: ['./project-subcountry-list.component.scss']
})
export class ProjectSubcountryListComponent implements OnInit {
  constructor(private modalService:NgbModal){}
  ngOnInit(): void {}
  subCountry()
  {
    const modalRef = this.modalService.open(AddSubcountryComponent, { size: 'xl' });
  }
}
