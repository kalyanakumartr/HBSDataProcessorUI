import { Component, Input, IterableDiffers, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DualListComponent } from 'angular-dual-listbox';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../../auth';
import { SubCountry } from '../../auth/_models/sub-country.model';
import { ProjectService } from '../../auth/_services/project.services';



@Component({
  selector: 'app-project-assign-subcountry',
  templateUrl: './project-assign-subcountry.component.html',
  styleUrls: ['./project-assign-subcountry.component.scss']
})
export class ProjectAssignSubcountryComponent implements OnInit {
  @Input() projectId: string;
  tab = 1;
  keepSorted = true;
  key: string;
  display: string;
  filter = false;
  source: Array<SubCountry>=[];
  confirmed: Array<SubCountry>=[];
  userAdd = '';
  disabled = false;

  sourceLeft = true;
  format: any = DualListComponent.DEFAULT_FORMAT;

  private sourceSubCountry: Array<SubCountry>=[];

  private confirmedSubCountry: Array<SubCountry> =[];

  constructor(
    private projectService: ProjectService,
    public modal: NgbActiveModal
  ) {

  }

  save(){
    console.log("Save confirmedSubCountry", this.confirmedSubCountry);
  }

  ngOnInit(): void {
    this.doReset();
  }

  private useSubCountry() {
    this.key = 'country';
    this.display = 'countryName';
    this.keepSorted = true;
    this.source = this.sourceSubCountry;
    this.confirmed = this.confirmedSubCountry==undefined?[]:this.confirmedSubCountry;
  }
  private setSelectedSubCountry(){
    //this.confirmed = this.confirmedSubCountry;
  }
  doReset() {
    this.projectService.getProjectSubCountryList("").pipe(
      tap((res: Array<SubCountry>) => {
        this.sourceSubCountry = res;
        this.useSubCountry();
        console.log("subCountryList", this.sourceSubCountry)
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();

      this.projectService.getProjectSubCountryList(this.projectId).pipe(
        tap((res: Array<SubCountry>) => {
          this.confirmedSubCountry = res;
          //this.useSubCountry();
          console.log("confirmedSubCountry", this.confirmedSubCountry)
        }),
        catchError((err) => {
          console.log(err);
          return of({
            items: []
          });
        })).subscribe();
  }

  filterBtn() {
    return (this.filter ? 'Hide Filter' : 'Show Filter');
  }

  doDisable() {
    this.disabled = !this.disabled;
  }

  disableBtn() {
    return (this.disabled ? 'Enable' : 'Disabled');
  }

  swapDirection() {
    this.sourceLeft = !this.sourceLeft;
    this.format.direction = this.sourceLeft ? DualListComponent.LTR : DualListComponent.RTL;
  }

}
