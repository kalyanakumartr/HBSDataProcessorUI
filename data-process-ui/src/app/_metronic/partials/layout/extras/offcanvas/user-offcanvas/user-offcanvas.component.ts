import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../../../core';
import { Observable } from 'rxjs';
import { UserModel } from '../../../../../../modules/auth/_models/user.model';
import { AuthService } from '../../../../../../modules/auth/_services/auth.service';
import { UpdatePasswordComponent } from 'src/app/modules/user-management/update-password/update-password.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-offcanvas',
  templateUrl: './user-offcanvas.component.html',
  styleUrls: ['./user-offcanvas.component.scss'],
})
export class UserOffcanvasComponent implements OnInit {
  extrasUserOffcanvasDirection = 'offcanvas-right';
  user$: Observable<UserModel>;
  tabs = {
    PERSONAL_TAB: 0,
    HR_TAB: 1,
    IT_TAB: 2,
    OPERATIONAL_TAB: 3
  };
  activeTabId = this.tabs.PERSONAL_TAB;
  constructor(private layout: LayoutService, private auth: AuthService,
    private modalService: NgbModal,) {}

  ngOnInit(): void {
    this.extrasUserOffcanvasDirection = `offcanvas-${this.layout.getProp(
      'extras.user.offcanvas.direction'
    )}`;
    this.user$ = this.auth.currentUserSubject.asObservable();
  }
  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }
  logout() {
    this.auth.logout();
    document.location.reload();
  }
  changePassword()
  {
    const modalRef = this.modalService.open(UpdatePasswordComponent, {
      size: 'xl'    });
  }
}
