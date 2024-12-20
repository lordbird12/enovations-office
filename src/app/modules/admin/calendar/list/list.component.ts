

import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { PageService } from '../page.service';
import { DataTablesModule } from 'angular-datatables';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { DateTime } from 'luxon';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'calendar',
  templateUrl: './list.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    NgClass,
    MatInputModule,
    TextFieldModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatChipsModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatTableModule,
    DataTablesModule,
    FullCalendarModule,
    MatAutocompleteModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // เพิ่ม CUSTOM_ELEMENTS_SCHEMA
})

export class CalendarOrderComponent implements OnInit, AfterViewInit {
  isLoading: boolean = false;
  dtOptions: DataTables.Settings = {};
  positions: any[];
  // public dataRow: any[];
  dataRow: any[] = [];
  allProduct: any[] = [];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    weekends: true,
    events: []
  };

  user: any;
  formData: FormGroup
  ///workstationFilter
  productFilter = new FormControl('');
  filterProduct: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  productData: any[] = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    private dialog: MatDialog,
    private _changeDetectorRef: ChangeDetectorRef,
    private _service: PageService,
    private _router: Router,
    private _activated: ActivatedRoute
  ) {
    this.user = JSON.parse(localStorage.getItem('user'))
    this.productData = this._activated.snapshot.data.allProduct
    this.filterProduct.next(this.productData.slice());

  }

  ngOnInit() {

    this.productFilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this._filterSale();
      });
  }


        /**
     * On destroy
     */  protected _onDestroy = new Subject<void>();

  ngAfterViewInit(): void {
    this._changeDetectorRef.detectChanges();
  }

  protected _filterSale() {
    if (!this.productData) {
        return;
    }
    let search = this.productFilter.value;
    if (!search) {
        this.filterProduct.next(this.productData.slice());
        return;
    } else {
        search = search.toLowerCase();
    }
    this.filterProduct.next(
        this.productData.filter(item => item.name.toLowerCase().indexOf(search) > -1)
    );
}



  // เพิ่มเมธอด editElement(element) และ deleteElement(element)
  // editElement(element: any) {
  //     const dialogRef = this.dialog.open(EditDialogComponent, {
  //         width: '500px', // กำหนดความกว้างของ Dialog
  //         data: {
  //                 data: element,
  //         } // ส่งข้อมูลเริ่มต้นไปยัง Dialog
  //     });

  //     dialogRef.afterClosed().subscribe(result => {
  //         if (result) {
  //             // เมื่อ Dialog ถูกปิด ดำเนินการตามผลลัพธ์ที่คุณได้รับจาก Dialog
  //         }
  //     });
  // }




  deleteElement() {
    // เขียนโค้ดสำหรับการลบออกองคุณ
  }

  onSelectProduct(event: any, type: any) {
    if (!event) {
      if (this.productFilter.invalid) {
        this.productFilter.markAsTouched();
      }
      return;
    }
    const _value = event;
    const selectedData = this.productData.find(item => item.name === _value);
    if (selectedData) {
    
      const events = selectedData.books.map((item) => ({
        title: selectedData.name + ' ' + '[' + selectedData?.serial_no + ']',
        start: item.start_date,
        end: DateTime.fromISO(item.end_date).plus({ days: 1 }).toISODate() // เพิ่ม 1 วันให้ end_date
      
      }));

      this.calendarOptions = {
        events: events
      };
      console.log(this.calendarOptions);
      let data = selectedData.name + ' ' + '[' + selectedData?.serial_no + ']'
      this.productFilter.setValue(data)
    } else {
      if (this.productFilter.invalid) {
        this.productFilter.markAsTouched();
      }
      return;
    }
  }

}


