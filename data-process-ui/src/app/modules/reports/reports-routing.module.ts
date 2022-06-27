import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { WebUploadReportComponent } from './web-upload-report/web-upload-report.component';


const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: [
      {
        path: 'webupload',
        component: WebUploadReportComponent,
      },

      { path: '', redirectTo: 'report', pathMatch: 'full' },
      { path: '**', redirectTo: 'report', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
