import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HoldWorkunitListComponent } from './hold-workunit-list/hold-workunit-list.component';
import { ProjectStatusComponent } from './project-status/project-status.component';
import { ReportsComponent } from './reports.component';
import { WebUploadReportComponent } from './web-upload-report/web-upload-report.component';
import { WuDeliveryListComponent } from './wu-delivery-list/wu-delivery-list.component';
import { WuHoldSummaryComponent } from './wu-hold-summary/wu-hold-summary.component';


const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: [
      {
        path: 'webupload',
        component: WebUploadReportComponent,
      },
      {
        path: 'wuholdlist',
        component: HoldWorkunitListComponent,
      },
      {
        path: 'deliverylist',
        component: WuDeliveryListComponent,
      },
      {
        path: 'projectstatus',
        component: ProjectStatusComponent,
      },
      {
        path: 'holdsummary',
        component: WuHoldSummaryComponent,
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
