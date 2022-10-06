import { Component, IterableDiffers, OnInit } from '@angular/core';
import { yearsPerRow } from '@angular/material/datepicker';
import { DualListComponent } from 'angular-dual-listbox';

@Component({
  selector: 'app-project-assign-subcountry',
  templateUrl: './project-assign-subcountry.component.html',
  styleUrls: ['./project-assign-subcountry.component.scss']
})
export class ProjectAssignSubcountryComponent extends DualListComponent implements OnInit {

  constructor( differs: IterableDiffers) {
    super(differs);
  }

  ngOnInit(): void {
  }

}
