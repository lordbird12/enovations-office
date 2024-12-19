

import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { Router } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
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
        FullCalendarModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA] // เพิ่ม CUSTOM_ELEMENTS_SCHEMA
})

export class CalendarOrderComponent implements OnInit, AfterViewInit {
    isLoading: boolean = false;
    dtOptions: DataTables.Settings = {};
    positions: any[];
    // public dataRow: any[];
    dataRow: any[] = [];

    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        weekends: false,
        events: [
          { title: 'Meeting', start: new Date() }
        ]
      };

    user: any;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    constructor(
        private dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: PageService,
        private _router: Router
    ) {
        this.user = JSON.parse(localStorage.getItem('user'))
     }

    ngOnInit() {
        this._service.getById(this.user).subscribe((resp:any)=>{
            // แปลงข้อมูลที่ได้ให้ตรงกับ FullCalendar
          const events = resp.map((item) => ({
            // title: item.title,
            start: item.start_date, // ค่าที่ได้จาก API
            end: item.end_date // ค่าที่ได้จาก API
          }));

          // อัปเดต events ใน calendarOptions
          this.calendarOptions = {
            ...this.calendarOptions,
            events
          };
        })
    }

    ngAfterViewInit(): void {
        this._changeDetectorRef.detectChanges();
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
}


