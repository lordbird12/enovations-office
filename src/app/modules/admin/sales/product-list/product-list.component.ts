import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    OnDestroy,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { Subject, takeUntil } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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
        NgxMatSelectSearchModule,
    ],
})
export class ProductListComponent implements OnInit, AfterViewInit, OnDestroy {
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

    // Filter controls for search
    categoryFilterCtrl: FormControl = new FormControl();
    brandFilterCtrl: FormControl = new FormControl();
    machineModelFilterCtrl: FormControl = new FormControl();

    // Filtered data
    filteredCategories: any[] = [];
    filteredBrands: any[] = [];
    filteredMachineModels: any[] = [];

    // Flags to track if filters are already set up
    private categoryFilterSetup = false;
    private brandFilterSetup = false;
    private machineModelFilterSetup = false;

    private _onDestroy = new Subject<void>();

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
            this.filteredCategories = resp.data.slice();
            this.setupCategoryFilter();
        });
    }

    getBrand(): void {
        this._service.getBrand().subscribe((resp) => {
            this.itemBrand = resp.data;
            this.filteredBrands = resp.data.slice();
            this.setupBrandFilter();
        });
    }

    getMachineModel(): void {
        this._service.getMachineModel().subscribe((resp) => {
            this.itemMC = resp.data;
            this.filteredMachineModels = resp.data.slice();
            this.setupMachineModelFilter();
        });
    }

    setupCategoryFilter(): void {
        if (this.categoryFilterSetup) return;
        this.categoryFilterSetup = true;
        this.categoryFilterCtrl.valueChanges
            .pipe(
                startWith(''),
                map(value => {
                    const data = this.item1Data || [];
                    return this._filter(data, value, 'name');
                }),
                takeUntil(this._onDestroy)
            )
            .subscribe(filtered => {
                this.filteredCategories = filtered;
            });
    }

    setupBrandFilter(): void {
        if (this.brandFilterSetup) return;
        this.brandFilterSetup = true;
        this.brandFilterCtrl.valueChanges
            .pipe(
                startWith(''),
                map(value => {
                    const data = this.itemBrand || [];
                    return this._filter(data, value, 'name');
                }),
                takeUntil(this._onDestroy)
            )
            .subscribe(filtered => {
                this.filteredBrands = filtered;
            });
    }

    setupMachineModelFilter(): void {
        if (this.machineModelFilterSetup) return;
        this.machineModelFilterSetup = true;
        this.machineModelFilterCtrl.valueChanges
            .pipe(
                startWith(''),
                map(value => {
                    const data = this.itemMC || [];
                    return this._filter(data, value, 'name');
                }),
                takeUntil(this._onDestroy)
            )
            .subscribe(filtered => {
                this.filteredMachineModels = filtered;
            });
    }

    private _filter(data: any[], value: string, property: string): any[] {
        if (!data) return [];
        const filterValue = value?.toLowerCase() || '';
        return data.filter(item => item[property]?.toLowerCase().includes(filterValue));
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
        this.categoryFilterCtrl.setValue('');
        this.brandFilterCtrl.setValue('');
        this.machineModelFilterCtrl.setValue('');
    }

    ngOnDestroy(): void {
        this._onDestroy.next();
        this._onDestroy.complete();
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
