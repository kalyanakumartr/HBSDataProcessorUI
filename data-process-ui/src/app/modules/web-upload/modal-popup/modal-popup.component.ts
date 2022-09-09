import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: 'app-operational-modal-popup',
  templateUrl: './modal-popup.component.html',
  styleUrls: ['./modal-popup.component.scss'],
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module

})
export class ModalPopup {
  @Input() comments;

  constructor(public activeModal: NgbActiveModal) {

  }
  ngOnInit(): void {
    console.log(this.comments);
  }
  }
