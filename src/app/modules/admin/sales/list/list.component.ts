import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
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
import { FormDialogComponent } from '../form-dialog/form-dialog.component';
import { PageService } from '../page.service';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { ActivatedRoute, Router } from '@angular/router';
import { PictureComponent } from '../../picture/picture.component';
import { FormReportComponent } from '../../product/form-report/form-report.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'employee-list-sales',
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
        MatTabsModule,
    ],
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {
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
    viewMode: 'default' | 'marketing-pending' | 'marketing-all' | 'warehouse' = 'default';
    marketingTabs = [
        { status: '', label: 'ทั้งหมด' },
        { status: 'Ordered', label: 'รออนุมัติ' },
        { status: 'Confirm', label: 'อนุมัติ' },
        { status: 'Reject', label: 'ไม่อนุมัติ' },
        { status: 'Returned', label: 'เสร็จสิ้น' },
        { status: 'Finish', label: 'รอคืน' },
    ] as const;
    marketingTabIndex = 0;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    private queryParamsSubscription?: Subscription;
    constructor(
        private dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: PageService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute
    ) {
        this.user = JSON.parse(localStorage.getItem('user'))
    }

    ngOnInit() {
        this.applyViewModeFromQuery();
        this.loadTable();

        // Subscribe to query params changes to handle menu switching
        this.queryParamsSubscription = this._activatedRoute.queryParams
            .subscribe(params => {
                const previousViewMode = this.viewMode;
                const previousStatus = this.selectedStatus;
                this.applyViewModeFromQuery();

                // If view mode or status changed, re-render the table
                if (previousViewMode !== this.viewMode || previousStatus !== this.selectedStatus) {
                    // Wait for view to update and ensure dtElement is ready before re-rendering
                    setTimeout(() => {
                        if (this.dtElement) {
                            this.rerender();
                        }
                    }, 150);
                }
            });
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.dtTrigger.next(this.dtOptions);
        }, 200);
        this._changeDetectorRef.detectChanges();
    }

    ngOnDestroy(): void {
        if (this.queryParamsSubscription) {
            this.queryParamsSubscription.unsubscribe();
        }
    }

    // เพิ่มเมธอด editElement(element) และ deleteElement(element)
    editElement(element: any) {
        this._router.navigate(['admin/sales/view/' + element.id]);
    }
    addElement(data: any) {
        if (data === 'Echocardiogram') {
            this._router.navigate(['admin/sales/form/echocardiogram']);
        } else if (data === 'Ultrasound Imaging') {
            this._router.navigate(['admin/sales/form/ultrasound-imaging']);
        } else if (data === 'ec') {
            this._router.navigate(['admin/sales/form/ec']);
        } else if (data === 'rc') {
            this._router.navigate(['admin/sales/form/rc']);
        }
    }


    pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 };
    loadTable(): void {
        const that = this;
        this.dtOptions = {
            pagingType: "full_numbers",
            pageLength: 25,
            serverSide: true,
            processing: true,
            language: {
                url: "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json",
            },
            order: [[0, 'desc']],
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = this.selectedStatus || null;
                // dataTablesParameters.user_id = 2;
                that._service.getPage(dataTablesParameters).subscribe((resp: any) => {
                    this.dataRow = resp.data;
                    console.log(this.dataRow)
                    this.pages.current_page = resp.current_page;
                    this.pages.last_page = resp.last_page;
                    this.pages.per_page = resp.per_page;
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
        if (this.viewMode === 'marketing-pending') {
            return;
        }
        this.selectedStatus = status;
        this.rerender();
    }

    onMarketingTabIndexChange(index: number): void {
        const tab = this.marketingTabs[index];
        if (!tab) {
            return;
        }
        this.marketingTabIndex = index;
        this.selectedStatus = tab.status;
        this.rerender();
    }

    rerender(): void {
        if (!this.dtElement) {
            return;
        }
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload(null, false); // false = don't reset paging
        }).catch((error) => {
            console.warn('Error reloading DataTable:', error);
            // If table is not initialized yet, try to initialize it
            if (this.dtTrigger) {
                this.dtTrigger.next(this.dtOptions);
            }
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

    private applyViewModeFromQuery(): void {
        const view = this._activatedRoute.snapshot.queryParamMap.get('view');
        const status = this._activatedRoute.snapshot.queryParamMap.get('status');

        if (view === 'marketing-pending') {
            this.viewMode = 'marketing-pending';
            this.selectedStatus = 'Ordered';
            this.marketingTabIndex = 0; // Reset tab index
            this._changeDetectorRef.markForCheck();
            return;
        }
        if (view === 'marketing-all') {
            this.viewMode = 'marketing-all';
            this.selectedStatus = ''; // Default to 'ทั้งหมด' tab
            this.marketingTabIndex = this.marketingTabs.findIndex(
                (t) => t.status === this.selectedStatus
            );
            if (this.marketingTabIndex < 0) {
                this.marketingTabIndex = 0;
            }
            this._changeDetectorRef.markForCheck();
            return;
        }
        // If status query param exists without view param, it's from warehouse
        if (status && !view) {
            this.viewMode = 'warehouse';
            this.selectedStatus = status;
            this.marketingTabIndex = 0; // Reset tab index
            this._changeDetectorRef.markForCheck();
            return;
        }
        this.viewMode = 'default';
        // If status query param exists, use it; otherwise default to empty
        this.selectedStatus = status || '';
        this.marketingTabIndex = 0; // Reset tab index
        this._changeDetectorRef.markForCheck();
    }
}
