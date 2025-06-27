

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
import { DataTablesModule } from 'angular-datatables';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { DateTime } from 'luxon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { PageService } from '../../sales/page.service';
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

export class CalendarOrderLineComponent implements OnInit, AfterViewInit {
  isLoading: boolean = false;
  dtOptions: DataTables.Settings = {};
  positions: any[];
  // public dataRow: any[];
  dataRow: any[] = [];
  allProduct: any[] = [];
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
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

  prodFilter: any[] = [];
  ///sale_user
  saleFilter = new FormControl('');
  filterSale: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  saleData: any[] = [];
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
    this.saleData = this._activated.snapshot.data.user.data
    this.filterSale.next(this.saleData.slice());
  }

  ngOnInit() {
    console.log(this.user);

    if (this.user?.position_id === "1") {
      this._service.getById(this.user?.id).subscribe((resp: any) => {
        const events = resp.map((item) => ({

          id: item.id,
          title: this.getNamesFromMachineModels(item.machine_models),
          start: item.start_date,
          end: DateTime.fromISO(item.end_date).plus({ days: 1 }).toISODate() // เพิ่ม 1 วันให้ end_date

        }));

        this.calendarOptions = {
          events: events,
          eventClick: this.onEventClick.bind(this)
        };
        this._changeDetectorRef.markForCheck()
      })
    }



    this.productFilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this._filterProduct();
      });
    this.saleFilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this._filterSale();
      });
  }

  getNamesFromMachineModels(ArrayValue: any) {
    const machineModels = ArrayValue; // ดึงค่าทั้งหมดจาก FormArray
    const result = machineModels.map((model: any) => model.product?.name).join(',');
    // console.log(result); // ผลลัพธ์: "aaa,bbbb,cccc"
    return result;
  }
        /**
     * On destroy
     */  protected _onDestroy = new Subject<void>();

  ngAfterViewInit(): void {
    this._changeDetectorRef.detectChanges();
  }

  protected _filterProduct() {
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
  protected _filterSale() {
    if (!this.saleData) {
      return;
    }
    let search = this.saleFilter.value;
    if (!search) {
      this.filterSale.next(this.saleData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filterSale.next(
      this.saleData.filter(item => item.name.toLowerCase().indexOf(search) > -1)
    );
  }

  onSelectSale(event: any, type: any) {
    if (!event) {
      if (this.saleFilter.invalid) {
        this.saleFilter.markAsTouched();
      }
      return;
    }
    const _value = event;
    const selectedData = this.saleData.find(item => item.name === _value);
    if (selectedData) {
      this._service.getOrderByUserCalendar(selectedData.id).subscribe((resp: any) => {
        const events = resp.calendars.map((item) => ({
          id: item.order_id,
          // title: this.getNamesFromMachineModels(item.machine_models),
          title: item.order?.code,
          start: item.start_date,
          end: DateTime.fromISO(item.end_date).plus({ days: 1 }).toISODate() // เพิ่ม 1 วันให้ end_date

        }));

        this.calendarOptions = {
          events: events,
          eventClick: this.onEventClick.bind(this)
        };
     // ถ้ามี event ใน list ให้พาไปที่ event แรก
     if (events.length > 0) {
      const firstEventDate = events[0].start;
      setTimeout(() => {
        if (this.calendarComponent) {
          this.calendarComponent.getApi().gotoDate(firstEventDate);
        }
      }, 100); // รอให้ calendar โหลดก่อน
    }

        this._changeDetectorRef.markForCheck()
      })
      this.saleFilter.setValue(selectedData?.name)
    } else {
      if (this.saleFilter.invalid) {

        this.saleFilter.markAsTouched(); // กำหนดสถานะ touched เพื่อแสดง mat-error
      }
      return;
    }
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

  filterProductType(data: any, type: any) {
    this.prodFilter = data.products;

  }

  onSelectProduct(event: any, type: any) {
    if (!event) {
      console.log('no event');
      return;
    }

    const selectedData = this.prodFilter.find(item => item.name === event);
    if (!selectedData)

      return;

    this._service.getOrderByProductCalendar(selectedData.id).subscribe((resp: any) => {
      if (!resp?.calendars?.length) {
        this.calendarOptions = {
          events: []
        }
        return; // ตรวจสอบว่ามีข้อมูลใน calendars หรือไม่
      }

      this.calendarOptions = {
        events: resp.calendars.map(item => ({
          id: item.id,
          title: `${item.code} ${resp.name} ${resp?.serial_no || ''}`,
          start: item.start_date,
          end: DateTime.fromISO(item.end_date).plus({ days: 1 }).toISODate(), // เพิ่ม 1 วันให้ end_date
        })),
        eventClick: this.onEventClick.bind(this),

      };

      this._changeDetectorRef.markForCheck();
    });
  }


  onEventClick(info: any): void {
    const eventId = info.event.id; // ดึง ID ของอีเวนต์ที่คลิก
    console.log(eventId);

    this._router.navigate(['/line/view/booking/' + eventId]); // นำทางไปยังหน้าที่กำหนด พร้อมพารามิเตอร์
  }

  goToList(): void {
    this._router.navigate(['/line/list/booking']); // นำทางไปยังหน้าที่กำหนด พร้อมพารามิเตอร์
  }

}


