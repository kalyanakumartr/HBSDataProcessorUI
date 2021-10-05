import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { WebUploadRoutingModule } from './web-upload-routing.module';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { WebUploadComponent } from './web-upload.component';
import { MyWorkComponent } from './my-work/my-work.component';
import { UploadFilesComponent } from './uploaded-files/uploaded-files.component';
import { WorkUnitModalComponent } from './work-unit-modal/work-unit-modal.component';


@NgModule({
  declarations: [WebUploadComponent,FileUploadComponent, UploadFilesComponent,MyWorkComponent, WorkUnitModalComponent],
  imports: [CommonModule, WebUploadRoutingModule,   CommonModule,   HttpClientModule, CRUDTableModule,    FormsModule,    ReactiveFormsModule, InlineSVGModule, NgbDatepickerModule, NgbModalModule, MatSnackBarModule],
})

export class WebUploadModule { }
