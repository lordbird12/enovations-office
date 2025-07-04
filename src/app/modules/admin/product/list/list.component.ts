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
import { Service } from '../page.service';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { PictureComponent } from '../../picture/picture.component';
import { FormReportComponent } from '../form-report/form-report.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { CompanyDialogComponent } from '../adjust-dialog/dailog.component';
import { DialogImportForm } from 'app/shared/dialog-import/dialog.component';

@Component({
    selector: 'employee-list-product',
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
    ],
})
export class ListComponent implements OnInit, AfterViewInit {
    @ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;
    isLoading: boolean = false;
    dtOptions: DataTables.Settings = {};
    positions: any[];
    form: FormGroup;
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    itemSupplier: any
    item1Data: any
    itemBrand: any;
    itemMC: any;
    companie: any;
    // public dataRow: any[];
    dataRow: any[] = [];
    user: any
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    constructor(
        private dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: Service,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService,
        private _fb: FormBuilder
    ) {
        this.user = JSON.parse(localStorage.getItem('user') || '{}');
        this.form = this._fb.group({
            category_product_id: '',
            supplier_id: '',
            brand_id: '',
            machine_model_id: '',
            type: '',
            status: '',
            companie_id: '',
            area_id: '',
        })
        console.log(this.user, 'user');

    }

    getSuppliers(): void {
        this._service.getSuppliers().subscribe((resp) => {
            this.itemSupplier = resp.data;
        });
    }

    getCategories(): void {
        this._service.getCategories().subscribe((resp) => {
            this.item1Data = resp.data;
        });
    }

    getBrand(): void {
        this._service.getBrand().subscribe((resp) => {
            this.itemBrand = resp.data;
        });

    }

    getMachineModel(): void {
        this._service.getMachineModel().subscribe((resp) => {
            this.itemMC = resp.data;
        });



    }

    getCompanie(): void {
        this._service.getCompanie().subscribe((resp) => {
            this.companie = resp.data;
        });
    }

    areas: any[] = [];
    somethingCompanie(event: any): void {
        const item = this.companie.find(item => item.id === event.value);
        this.areas = item.areas
    }

    ngOnInit() {
        this.loadTable();
        this.getCategories();
        this.getBrand();
        // this.getSuppliers();
        this.getCompanie();
        this.getMachineModel();
    }

    ngAfterViewInit(): void {
        this._changeDetectorRef.detectChanges();
    }

    ClearForm() {
        this.form.reset()
    }

    search() {
        this.rerender()
    }
    reset() {
        this.form.reset()
        this.form.patchValue({
            category_product_id: '',
            supplier_id: '',
            brand_id: '',
            machine_model_id: '',
            type: '',
            status: '',
            companie_id: '',
            area_id: '',
        })
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }

    // เพิ่มเมธอด editElement(element) และ deleteElement(element)
    editElement(data: any) {
        this._router.navigate(['/admin/product/edit/' + data.id])
    }

    viewElement(element: any) {
        const dialogRef = this.dialog.open(EditDialogComponent, {
            width: '700px', // กำหนดความกว้างของ Dialog
            data: element
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                //    console.log(result,'result')
            }
        });
    }

    downloadReport() {
        const dialogRef = this.dialog.open(FormReportComponent, {
            width: '700px', // กำหนดความกว้างของ Dialog
            maxHeight: '900px'

        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                //    console.log(result,'result')
            }
        });
    }

    addElement() {
        this._router.navigate(['admin/product/form']);
    }

    pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 };
    loadTable(): void {
        const that = this;
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 25,
            serverSide: true,
            processing: true,
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json',
            },
            order: [[0, 'desc']], // Default ordering by 'created_at' in descending order
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.type = this.form.value.type;
                dataTablesParameters.status = this.form.value.status;
                dataTablesParameters.category_product_id = this.form.value.category_product_id;
                dataTablesParameters.brand_id = this.form.value.brand_id;
                dataTablesParameters.machine_model_id = this.form.value.machine_model_id;

                that._service
                    .getPage(dataTablesParameters)
                    .subscribe((resp: any) => {
                        this.dataRow = resp.data;
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
                { data: 'create_by' },
                { data: 'created_at' },
            ],
        };
    }

    deleteElement(itemid: any) {
        const confirmation = this._fuseConfirmationService.open({
            title: 'ลบข้อมูล',
            message: 'คุณต้องการลบข้อมูลใช่หรือไม่ ?',
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'warning',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'ยืนยัน',
                    color: 'warn',
                },
                cancel: {
                    show: true,
                    label: 'ยกเลิก',
                },
            },
            dismissible: true,
        });
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this._service.delete(itemid).subscribe((resp) => {
                    this.rerender();
                });
            }
            error: (err: any) => { };
        });
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

    adjustDialog() {
        const dialogRef = this.dialog.open(CompanyDialogComponent, {
            width: '100%',
            height: '80%', // กำหนดความกว้างของ Dialog
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                // this.companyList = result.map((item) => item.id);
                // this.rerender();
            }
        });
    }

    openDialogImort(): void {
        this.dialog
            .open(DialogImportForm, {
                width: '600px',
                height: 'auto',

                autoFocus: false,
                data: {
                    type: 'Product'
                },
            })
            .afterClosed()
            .subscribe((resp: any) => {
                if (resp) {
                    this.rerender()
                }
                // Go up twice because card routes are setup like this; "card/CARD_ID"
                // this._router.navigate(['./../..'], {relativeTo: this._activatedRoute});
            });
    }
}
