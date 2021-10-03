import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';

@Component({
  selector: 'app-operational-user-modal',
  templateUrl: './work-unit-modal.component.html',
  styleUrls: ['./work-unit-modal.component.scss'],
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class WorkUnitModalComponent  {
  @Input() task: any;

  private subscriptions: Subscription[] = [];
  constructor(
        private fb: FormBuilder, public modal: NgbActiveModal
    ) {

    }

  ngOnInit(): void {


  }


}
