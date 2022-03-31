import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimeTrackerComponent } from './time-tracker/time-tracker.component';


const routes: Routes = [
  {
    path: '',
    component: TimeTrackerComponent,
    children: [
      {
        path: 'timeTracker',
        component: TimeTrackerComponent,
      },
      { path: '', redirectTo: 'timeTracker', pathMatch: 'full' },
      { path: '**', redirectTo: 'timeTracker', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimeTrackerRoutingModule {}
