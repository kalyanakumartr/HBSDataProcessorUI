import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { MyWorkComponent } from './my-work/my-work.component';
import { UploadFilesComponent } from './uploaded-files/uploaded-files.component';
import { WebUploadComponent } from './web-upload.component';

const routes: Routes = [{
  path: '',
  component: WebUploadComponent,
  children: [
    {
      path: 'file-upload',
      component: FileUploadComponent,
    },
    {
      path: 'uploaded-files',
      component: UploadFilesComponent,
    },
    {
      path: 'my-work',
      component: MyWorkComponent,
    },
    { path: '', redirectTo: 'users', pathMatch: 'full' },
    { path: '**', redirectTo: 'users', pathMatch: 'full' },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebUploadRoutingModule { }
