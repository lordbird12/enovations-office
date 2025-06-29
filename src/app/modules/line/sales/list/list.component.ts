import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { FormDialogComponent } from '../form-dialog/form-dialog.component';
import { PageService } from '../page.service';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { FormReportComponent } from 'app/modules/admin/product/form-report/form-report.component';
import { PictureComponent } from '../picture/picture.component';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import liff from '@line/liff';
import { LineService } from '../../line.service';
import { firstValueFrom, Subject, timeout } from 'rxjs';
@Component({
    selector: 'line-list-sales',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
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
        MatMenuModule,
        MatDividerModule
    ],
})
export class ListComponent implements OnInit, AfterViewInit {
    searchQuery: string = ''
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    @ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;
    dtTrigger: Subject<any> = new Subject();
    isLoading: boolean = false;
    dtOptions: DataTables.Settings = {};
    positions: any[];
    // public dataRow: any[];
    dataRow: any[] = [];
    user: any
    selectedStatus: string = '';
    form: FormGroup

    userIdFromLine: string = '';
    displayName: string = '';
    pictureUrl: string = '';
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    constructor(
        private dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: PageService,
        private _lineService: LineService,
        private _router: Router,
        private fb: FormBuilder
    ) {
        // this.user = JSON.parse(localStorage.getItem('user'))
        this.form = this.fb.group({
            user_id: [null]
        })
    }

    async ngOnInit(): Promise<void> {

        try {
            // 🔸 1. Init LIFF
            await liff.init({ liffId: '2007657331-oyjNGORd' });

            // // 🔸 2. ถ้ายังไม่ login → login แล้วกลับมาหน้าเดิม
            if (!liff.isLoggedIn()) {
                liff.login({ redirectUri: window.location.href });
                return;
            }

            // 🔸 3. login แล้ว → get profile
            const profile = await liff.getProfile();
            this.userIdFromLine = profile.userId;
            this.displayName = profile.displayName;
            this.pictureUrl = profile.pictureUrl;

            // this.userIdFromLine = 'U2a2bcd2365d0be23f9ab13e75bd82717';
            // ✅ Debug
            console.log('LINE userId:', this.userIdFromLine);

            // 🔸 4. เรียก login API
            const resp: any = await firstValueFrom(
                this._lineService.lineLogin(this.userIdFromLine).pipe(timeout(1000))
            );
            localStorage.setItem('user', JSON.stringify(resp.data));
            localStorage.setItem('token', resp.token);

            this.loadTable(resp.token);
            // ✅ รอให้ Angular render DOM เสร็จ ก่อน trigger
            Promise.resolve().then(() => {
                this.dtTrigger.next(this.dtOptions);
            });

            this._changeDetectorRef.markForCheck();

        } catch (err) {
            console.error('❌ LINE Login Failed:', err);
            // 🔸 fallback redirect ไปสมัคร
            if (this.userIdFromLine) {
                this._router.navigate(['/register'], {
                    queryParams: { user_id: this.userIdFromLine, image: this.pictureUrl },
                });
                return;
            }
        }
    }
    // เพิ่มเมธอด editElement(element) และ deleteElement(element)
    goToCalendar() {
        this._router.navigate(['line/calendar-timeline']);
    }
    editElement(element: any) {
        this._router.navigate(['line/view/booking/' + element.id]);
    }
    addElement(data: any) {
        if (data === 'Echocardiogram') {
            this._router.navigate(['line/form/echocardiogram']);
        } else if (data === 'Ultrasound Imaging') {
            this._router.navigate(['line/form/ultrasound-imaging']);
        } else if (data === 'ec') {
            this._router.navigate(['line/form/ec']);
        } else if (data === 'rc') {
            this._router.navigate(['line/form/rc']);
        }
    }

    addForm() {
        this._router.navigate(['line/form']);
    }

    openMyCalendar() {
        this._router.navigate(['line/calendar-timeline']);
    }
    openNews() {
        this._router.navigate(['line/news']);
    }
    openRate(id) {
        this._router.navigate(['line/rate/' + id]);
    }
    applySearch() {
        this.rerender()
    }
    pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0, total: 0 };
    loadTable(token: any): void {
        const that = this;
        this.dtOptions = {
            pagingType: "full_numbers",
            pageLength: 10,
            serverSide: true,
            processing: true,
            language: {
                url: "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json",
            },
            order: [[0, 'desc']],
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.search = { value: this.searchQuery };
                dataTablesParameters.status = this.selectedStatus || null;
                that._service.getPage(dataTablesParameters).subscribe((resp: any) => {
                    this.dataRow = resp.data;
                    console.log(this.dataRow)
                    this.pages.current_page = resp.current_page;
                    this.pages.last_page = resp.last_page;
                    this.pages.per_page = resp.per_page;
                    this.pages.total = resp.total;
                    if (resp.current_page > 1) {
                        this.pages.begin =
                            resp.per_page * resp.current_page - 1;
                    } else {
                        this.pages.begin = 0;
                    }

                    callback({
                        recordsTotal: resp.total,
                        recordsFiltered: resp.total,
                        data: [],
                    });
                    this._changeDetectorRef.markForCheck();
                });
            },
            columns: [
                { data: 'action', orderable: false },
                { data: 'No' },
                { data: 'name' },
                { data: 'picture' },
                { data: 'create_by' },
                { data: 'created_at' },

            ],
        };
    }

    deleteElement() {
        // เขียนโค้ดสำหรับการลบออกองคุณ
    }

    showPicture(imgObject: any): void {
        this.dialog
            .open(PictureComponent, {
                autoFocus: false,
                data: {
                    imgSelected: imgObject,
                },
            })
            .afterClosed()
            .subscribe(() => {
                // Go up twice because card routes are setup like this; "card/CARD_ID"
                // this._router.navigate(['./../..'], {relativeTo: this._activatedRoute});
            });
    }



    downloadReport(item: any) {
        const dialogRef = this.dialog.open(FormReportComponent, {
            width: '700px', // กำหนดความกว้างของ Dialog
            height: '700px',
            data: item

        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                //    console.log(result,'result')
            }
        });
    }

    joinSringModel(machine_models: any) {
        const result = machine_models.map(model => model.name).join(',');
        return result;
    }

    set_status(status: string): void {
        this.selectedStatus = status;
        this.currentStatus = status;
        this.rerender();
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }

    deleteorder(id: any) {
        this._service.delete(id).subscribe({
            next: (resp: any) => {
                this.rerender();
            },
            error: (err: any) => {
                console.log(err);
            }
        })
    }

    changePage(page: number): void {
        const info = $('#booking-list').DataTable();
        info.page(page - 1).draw('page'); // DataTables นับหน้าเริ่มที่ 0
    }

    getPageRange(): void {

    }

    ngAfterViewInit(): void {
        // setTimeout(() => {
        //     this.dtTrigger.next(this.dtOptions);
        // }, 200);
        this._changeDetectorRef.detectChanges();
    }

    // ใน component.ts
    currentStatus: string = '';


}
