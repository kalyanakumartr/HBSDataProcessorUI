import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LayoutService } from 'src/app/_metronic/core';
import { ProjectService } from '../../auth/_services/project.services';
import { WorkAllocationService } from '../../auth/_services/workallocation.service';
import { MyWorkComponent } from '../my-work/my-work.component';

@Component({
  selector: 'app-work-unit-search',
  templateUrl: './work-unit-search.component.html',
  styleUrls: ['./work-unit-search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WorkUnitSearchComponent implements OnInit {
  @Input() projectId: any;
  @Input() group: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  isLoading$;
  selValue:string;
  receivedDate:string;
  receivedDateList:any;
  subCountry:string;
  subCountryList:any;
  roadType:string;
  roadTypeList:any;
  holdReason:string;
  holdReasonList:any;
  team:string;
  teamList:any;
  formGroup: FormGroup;
  minDate : NgbDateStruct;
  maxDate : NgbDateStruct;
  toMinDate : NgbDateStruct;
  toMaxDate : NgbDateStruct;

  //leaveTypeList:{ [key: number]: string }=[{"key":"leave","value":"Full Day Leave"},{"key":"p4","value":"Half Day Leave"},{"key":"longleave","value":"Long Leave"}, {"key":"medicalleave","value":"Medical Leave"}];
  leaveTypeList:{ [key: string]: string }={"Leave":"Leave","P4":"Half Day Leave","Long_Leave":"Long Leave","Medical_Leave":"Medical Leave"};
  private subscriptions: Subscription[] = [];
  constructor(
    private snackBar: MatSnackBar,
    public workAllocationService: WorkAllocationService,
    public projectService: ProjectService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) {
      this.receivedDate="";
      this.selValue="0";
      this.roadType="0";
        const current = new Date();
        console.log(current.getFullYear(), current.getMonth(), current.getDate())
        this.maxDate={
          year: current.getFullYear(),
          month: current.getMonth() + 3,
          day: current.getDate()
        };
      this.minDate = {
        year: current.getFullYear(),
        month: current.getMonth() + 1,
        day: current.getDate()-7
      };
      this.toMaxDate={
        year: current.getFullYear(),
        month: current.getMonth() + 3,
        day: current.getDate()
      };
    this.toMinDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()-7
    };
      this.formGroup = new FormGroup({
        receivedDate: new FormControl(),
        workUnits: new FormControl(),
        wuMinMiles: new FormControl(),
        wuMaxMiles: new FormControl(),
        subCountry: new FormControl(),
        roadType: new FormControl(),
        holdReason: new FormControl(),
        team: new FormControl(),
        });
    }

  ngOnInit(): void {

    this.getReceivedDateList(this.projectId);
    this.getRoadTypeMapList(this.projectId);
    this.getSubCountryList(this.projectId);
    this.getTeamForGroup();
    this.getHoldReason(this.projectId);
  }
  ngAfterContentInit(): void{
    this.formGroup.value.roadType="0";
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition:"bottom"
    });
  }

  loadForm() {
    this.formGroup = this.fb.group({

      receivedDate: ['', Validators.compose([ ])],
      workUnits: [''],
      wuMinMiles: ['', Validators.compose([ ])],
      wuMaxMiles:[''],
      subCountry: ['', Validators.compose([ ])],
      roadType:['0', Validators.compose([ ])],
      holdReason: ['', Validators.compose([ ])],
      team: ['', Validators.compose([ ])],

    });
    console.log("00000", this.formGroup.value);
  }
  setDefaultValue(){

  }
  getReceivedDateList(projectId){
    this.receivedDateList=[];
    this.workAllocationService.getReceivedDateList(projectId).pipe(
      tap((res: any) => {
        this.receivedDateList = res;

            this.formGroup.patchValue({
              receivedDate : "0"
            });

      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();
  }
  getHoldReason(projectId){
    this.holdReasonList=[];
    this.workAllocationService.getHoldReasonList(projectId).pipe(
      tap((res: any) => {
        this.holdReasonList = res;
        if(this.holdReasonList.length>0){
          this.formGroup.patchValue({
            holdReason : "0"
          });
        }
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();
  }
  getSubCountryList(projectId){
    this.subCountryList=[];
    this.workAllocationService.getSubCountryList(projectId).pipe(
      tap((res: any) => {
        this.subCountryList = res;
        if(this.subCountryList.length>0){
          this.formGroup.patchValue({
            subCountry : "0"
          });
        }
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();
  }
  getRoadTypeMapList(projectId){
    this.roadTypeList=[];
    this.workAllocationService.getRoadTypeMapList(projectId).pipe(
      tap((res: any) => {
        this.roadTypeList = res;
        this.formGroup.patchValue({
          roadType : "0"
        });
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();
  }
  getTeamForGroup(){
    this.teamList=[];
    this.projectService.getTeamList(this.group).pipe(
      tap((res: any) => {
        this.teamList = res;
        this.formGroup.patchValue({
          team : "0"
        });
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();
  }
  advanceSearch() {
    const filter = {};
    const workUnits = this.formGroup.get('workUnits').value;
    const wuMinMiles = this.formGroup.get('wuMinMiles').value;
    const wuMaxMiles = this.formGroup.get('wuMaxMiles').value;
    const subCountry = this.formGroup.get('subCountry').value;
    const team = this.formGroup.get('team').value;
    const roadType = this.formGroup.get('roadType').value;
    const receivedDate = this.formGroup.get('receivedDate').value;
    const reasonId = this.formGroup.get('holdReason').value;
    this.workAllocationService.patchStateWithoutFetch({
      workUnitId:workUnits,
      startWUMiles:wuMinMiles,
      endWUMiles: wuMaxMiles,
      roadTypeMapId:roadType=="0"?"":roadType,
      subCountryId:subCountry=="0"?"":subCountry,
      teamName:team=="0"?"":team,
      receivedDate:receivedDate=="0"?"":receivedDate,
      reasonId:reasonId =="0"?"":reasonId,
      isAdvanceSearch:true,
    });
    this.workAllocationService.fetch('/searchTask');
    this.passEntry.emit(true);
    this.modal.dismiss();

  }

  resetDateFields(){


  }
  private prepareCustomer() {
    const formData = this.formGroup.value;


  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
  // format date in typescript
getFormatedDate(date: Date, format: string) {
  const datePipe = new DatePipe('en-US');
  return datePipe.transform(date, format);
}
/*  formatDate(date){
    var MyDate =new Date(date);
     var MyDateString = ('0' + MyDate.getDate()).slice(-2) + '/'
      + ('0' + (MyDate.getMonth()+1)).slice(-2) + '/'
      + MyDate.getFullYear();
      return MyDateString;
  }*/
}

