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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Service } from 'app/modules/admin/product/page.service';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';

@Component({
    selector: 'sales-product-list',
    templateUrl: './product-list.component.html',
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
export class ProductListComponent implements OnInit, AfterViewInit {
    @ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;
    isLoading: boolean = false;
    dtOptions: DataTables.Settings = {};
    form: FormGroup;
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    item1Data: any;
    itemBrand: any;
    itemMC: any;
    companie: any;
    dataRow: any[] = [];
    user: any;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: Service,
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
        this.areas = item.areas;
    }

    ngOnInit() {
        this.loadTable();
        this.getCategories();
        this.getBrand();
        this.getCompanie();
        this.getMachineModel();
    }

    ngAfterViewInit(): void {
        this._changeDetectorRef.detectChanges();
    }

    ClearForm() {
        this.form.reset();
    }

    search() {
        this.rerender();
    }

    reset() {
        this.form.reset();
        this.form.patchValue({
            category_product_id: '',
            supplier_id: '',
            brand_id: '',
            machine_model_id: '',
            type: '',
            status: '',
            companie_id: '',
            area_id: '',
        });
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
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
            order: [[0, 'desc']],
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
}
