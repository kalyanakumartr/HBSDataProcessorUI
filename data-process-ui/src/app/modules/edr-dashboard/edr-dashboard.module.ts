import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkAllocationComponent } from './work-allocation/work-allocation.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';



@NgModule({
  declarations: [WorkAllocationComponent],
  imports: [
    CommonModule, MatSnackBarModule, MatPaginatorModule, MatTableModule,MatSortModule, MatDividerModule, MatExpansionModule
  ],
  exports: [
    WorkAllocationComponent,
  ]
})
export class EdrDashboardModule { }
