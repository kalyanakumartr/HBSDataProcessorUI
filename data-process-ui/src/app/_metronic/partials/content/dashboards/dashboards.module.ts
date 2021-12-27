import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dashboard1Component } from './dashboard1/dashboard1.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';
import { Dashboard3Component } from './dashboard3/dashboard3.component';
import { DashboardWrapperComponent } from './dashboard-wrapper/dashboard-wrapper.component';
import { WidgetsModule } from '../widgets/widgets.module';
import { EdrDashboardModule } from 'src/app/modules/edr-dashboard/edr-dashboard.module';
import { WorkAllocationComponent } from 'src/app/modules/edr-dashboard/work-allocation/work-allocation.component';

@NgModule({
  declarations: [Dashboard1Component, Dashboard2Component, DashboardWrapperComponent, Dashboard3Component],
  imports: [CommonModule, WidgetsModule, EdrDashboardModule],
  exports: [DashboardWrapperComponent],
})
export class DashboardsModule { }
