

import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PageService } from '../page.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';

import moment from 'moment';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PictureComponent } from '../picture/picture.component';
import { environment } from 'environments/environment.development';
import { ClaimDialogComponent } from '../claim-dialog/claim-dialog.component';
import { DateTime } from 'luxon';
import { BehaviorSubject, distinctUntilChanged, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxMaskDirective } from 'ngx-mask';
import { MatRadioModule } from '@angular/material/radio';
import { CustomerDialogComponent } from '../customer-dialog/customer-dialog.component';
import { CarouselComponent } from '../image-slide/carousel.component';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
@Component({
    selector: 'form-product-sales',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        MatRadioModule,
        MatAutocompleteModule,
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
        MatCheckboxModule,
        MatChipsModule

    ],
})
export class FormComponent implements OnInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    fixedSubscriptInput: FormControl = new FormControl('', [Validators.required]);
    dynamicSubscriptInput: FormControl = new FormControl('', [Validators.required]);
    fixedSubscriptInputWithHint: FormControl = new FormControl('', [Validators.required]);
    dynamicSubscriptInputWithHint: FormControl = new FormControl('', [Validators.required]);
    isForm: boolean = true

    purpose: string[] = [
        'Demo', 'Install', 'Post', 'Sale', 'Present', 'Booth', 'Workshop'
    ];

    customerType: string[] = [
        'Government', 'Private', 'Clinic', 'Vet'
    ];
    departments: string[] = [
        'Cardiology',
        'X-RAY',
        'Rehab',
        'OR-CVT',
        'OR-Gen',
        'OR-Uro',
        'OR-Neuro',
        'OPD-ศัลยกรรม',
        'OPD-Vascular',
        'OPD-Urology',
        'OPD-Share service',
        'ER',
        'ICU',
        'ICU-Med',
        'ICU-Trauma',
        'ICU-ศัลยกรรม',
        'PICU',
        'NICU',
        'CCU',
        'RCU',
        'Cathlab',
        'Pain',
        'Anesthesia',
        'Med',
        'IPD',
        'Ortho',
        'ENT',
        'ไตเทียม',
        'IVF',
        'OB-ANC',
        'OB-LR'
    ];

    provinces: string[] = [
        'Bangkok',
        'Amnat Charoen',
        'Ang Thong',
        'Bueng Kan',
        'Buriram',
        'Chachoengsao',
        'Chai Nat',
        'Chaiyaphum',
        'Chanthaburi',
        'Chiang Mai',
        'Chiang Rai',
        'Chon Buri',
        'Chumphon',
        'Kalasin',
        'Kamphaeng Phet',
        'Kanchanaburi',
        'Khon Kaen',
        'Krabi',
        'Lampang',
        'Lamphun',
        'Loei',
        'Lop Buri',
        'Mae Hong Son',
        'Maha Sarakham',
        'Mukdahan',
        'Nakhon Nayok',
        'Nakhon Pathom',
        'Nakhon Phanom',
        'Nakhon Ratchasima',
        'Nakhon Sawan',
        'Nakhon Si Thammarat',
        'Nan',
        'Narathiwat',
        'Nong Bua Lam Phu',
        'Nong Khai',
        'Nonthaburi',
        'Pathum Thani',
        'Pattani',
        'Phang Nga',
        'Phatthalung',
        'Phayao',
        'Phetchabun',
        'Phetchaburi',
        'Phichit',
        'Phitsanulok',
        'Phrae',
        'Phuket',
        'Prachin Buri',
        'Prachuap Khiri Khan',
        'Ranong',
        'Ratchaburi',
        'Rayong',
        'Roi Et',
        'Sa Kaeo',
        'Sakon Nakhon',
        'Samut Prakan',
        'Samut Sakhon',
        'Samut Songkhram',
        'Sara Buri',
        'Satun',
        'Sing Buri',
        'Si Sa Ket',
        'Songkhla',
        'Sukhothai',
        'Suphan Buri',
        'Surat Thani',
        'Surin',
        'Tak',
        'Trang',
        'Trat',
        'Ubon Ratchathani',
        'Udon Thani',
        'Uthai Thani',
        'Uttaradit',
        'Yala',
        'Yasothon'
    ];


    finanaceData: any[] = [];

    paymentData: any[] = [];
    claimData: any[] = [];
    userData: any[] = [];
    images: any[] = [];
    image: string = '';
    itemData: any;

    Id: number;
    product_select: any;
    type: any = ''
    promotionData: any[] = [];

    formData: FormGroup;
    formattedDateTime: string;
    productSelected: any;

    ///sale_user
    saleFilter = new FormControl('', Validators.required);
    filterSale: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    saleData: any[] = [];

    ///finance_user
    financeFilter = new FormControl('');
    filterFinance: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    financeData: any[] = [];

    ///engineer_user
    engineerFilter = new FormControl('');
    filterEngineer: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    engineerData: any[] = [];

    ///brandModelFilter
    brandModelFilter = new FormControl('');
    filterBrandModel: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    brandModelData: any[] = [];

    ///brandFilterlFilter
    brandFilter = new FormControl('');
    filterBrand: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    brandData: any[] = [];


    garageData: any[] = []
    user_login: any = JSON.parse(localStorage.getItem('user'));

    ///productFilter
    productFilter = new FormControl();
    filterProduct: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    selectedProducts: any[] = [];
    productData: any[] = []

    ///workstationFilter
    workstationFilter = new FormControl('');
    filterWorkstation: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    workstationData: any[] = [];


    machineModelFilter = new FormControl('');
    filterMachineModel: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    mcData: any[] = [];

    ///workstationFilter
    accessorieFilter = new FormControl('');
    filterAccessorie: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    accessorieData: any[] = [];

    ///workstationFilter
    clientFilter = new FormControl('');
    filterClient: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    clientData: any[] = [];

    user: any
    pageType: any
    /**
     * Constructor
     */
    constructor(
        private _service: PageService,
        private _fb: FormBuilder,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService,
        public activatedRoute: ActivatedRoute,
        private dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,

    ) {

        this.type = this.activatedRoute.snapshot.data.type
        this.pageType = this.activatedRoute.snapshot.data.page_type

        this.productData = this.activatedRoute.snapshot.data.products.data
        this.memberData = this.productData
        this.tdData = this.productData
        this.filterProduct.next(this.productData.slice());

        this.accessorieData = this.activatedRoute.snapshot.data.products.data
        this.filterAccessorie.next(this.accessorieData.slice());

        this.workstationData = this.activatedRoute.snapshot.data.products.data
        this.filterWorkstation.next(this.workstationData.slice());

        this.saleData = this.activatedRoute.snapshot.data.user.data
        this.filterSale.next(this.saleData.slice());

        this.clientData = this.activatedRoute.snapshot.data.client.data
        this.filterClient.next(this.clientData.slice());

        this.mcData = this.activatedRoute.snapshot.data.machine_model.data
        this.filterMachineModel.next(this.mcData.slice());

        this.formData = this._fb.group({
            reserve_ref_no: null,
            calendar_date: null,
            budget: 0,
            request_purpose: null,
            user_id: null,
            function_qualifications: null,
            work_station_id: null,
            additional_equipment: null,
            meeting_details: null,
            current_machine_model: null,
            current_work_station: null,
            current_usage_problem: null,
            competitor_model: null,
            competitor_transducer: null,
            customer_feedback: null,
            client_id: null,
            customer_type: null,
            province: null,
            department: null,
            floor: null,
            kol_doctor: null,
            additional_info: null,
            status: null,
            create_by: null,
            update_by: null,
            start_date: null,
            end_date: null,
            machine_models: this._fb.array([]),
            transducers: this._fb.array([]),
            memberIds: [],
            tds: []

        });
    }

    ngOnInit() {
        if (this.pageType === 'EDIT') {
            this.activatedRoute.params.subscribe(params => {
                this.isForm = false;
                const id = params.id;
                this.Id = id
                this._service.getById(id).subscribe((resp: any) => {
                    this.itemData = resp.data;
                    // const memberIds = this.itemData.machine_models.map(model => Number(model.product_id));
                    // const tDs = this.itemData.transducers.map(model => Number(model.product_id));
                    // this.saleFilter.setValue(this.itemData.user?.name)
                    this.clientFilter.setValue(this.itemData.client?.name)
                    this.productFilter.setValue(this.itemData.product?.name)
                    this.accessorieFilter.setValue(this.itemData.product?.name)
                    this.workstationFilter.setValue(this.itemData.product?.name)
                    this.formData.patchValue({
                        ...this.itemData,

                    });
                    for (let index = 0; index < this.itemData.machine_models.length; index++) {
                        const element = this.itemData.machine_models[index];
                        this.machine_models.push(this._fb.group({
                            id: element.id,
                            machine_model_id: element.machine_model_id,
                            machine_model_name: element.machine_model.name,
                            qty: element.qty
                        }))

                    }

                    for (let index = 0; index < this.itemData.transducers.length; index++) {
                        const element = this.itemData.transducers[index];
                        this.transducers.push(this._fb.group({
                            id: element.id,
                            machine_model_id: element.machine_model_id,
                            machine_model_name: element.machine_model.name,
                            qty: element.qty
                        }))

                    }

                    this._changeDetectorRef.markForCheck();

                });
            });
        } else {
            const currentDateTime = DateTime.now();
            this.formattedDateTime = currentDateTime.toFormat('dd/MM/yyyy');
            this.formData.patchValue({

            })

            // Mock Data (สามารถเปลี่ยนเป็น API Response ได้)
            const mockData = {
                machine_models: [
                    { machine_model_id: '1', qty: 2 },
                    { machine_model_id: '2', qty: 2 }
                ],
                transducers: [
                    { machine_model_id: '1', qty: 2 },
                    { machine_model_id: '2', qty: 2 }
                ]
            };


        }
        this.saleFilter.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this._filterSale();
            });
        this.productFilter.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this._filterCar();
            });
        this.accessorieFilter.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this._filterAccessrie();
            });
        this.workstationFilter.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this._filterWorkStation();
            });
        this.clientFilter.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this._filterWorkStation();
            });
        this.machineModelFilter.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this._filterMachineModel();
            });
    }

    // Getter for FormArray
    get machineModels(): FormArray {
        return this.formData.get('machine_models') as FormArray;
    }

    get transducers(): FormArray {
        return this.formData.get('transducers') as FormArray;
    }

    // Set machine models
    setMachineModels(models: any[]) {
        this.machineModels.clear();
        models.forEach(model => {
            this.machineModels.push(this._fb.group({
                machine_model_id: [model.machine_model_id, Validators.required],
                qty: [model.qty, [Validators.required, Validators.min(1)]]
            }));
        });
    }

    // Set transducers
    setTransducers(transducers: any[]) {
        this.transducers.clear();
        transducers.forEach(transducer => {
            this.transducers.push(this._fb.group({
                machine_model_id: [transducer.machine_model_id, Validators.required],
                qty: [transducer.qty, [Validators.required, Validators.min(1)]]
            }));
        });
    }

    // Add new machine model
    addMachineModel() {
        this.machineModels.push(this._fb.group({
            machine_model_id: ['', Validators.required],
            qty: [1, [Validators.required, Validators.min(1)]]
        }));
    }

    // Remove machine model
    removeMachineModel(index: number) {
        this.machineModels.removeAt(index);
    }

    // Add new transducer
    addTransducer() {
        this.transducers.push(this._fb.group({
            machine_model_id: ['', Validators.required],
            qty: [1, [Validators.required, Validators.min(1)]]
        }));
    }

    // Remove transducer
    removeTransducer(index: number) {
        this.transducers.removeAt(index);
    }


        /**
     * On destroy
     */  protected _onDestroy = new Subject<void>();

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the form field helpers as string
     */

    protected _filterEngineer() {
        if (!this.engineerData) {
            return;
        }
        let search = this.engineerFilter.value;
        if (!search) {
            this.filterEngineer.next(this.engineerData.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        this.filterEngineer.next(
            this.engineerData.filter(item => item.name.toLowerCase().indexOf(search) > -1)
        );
    }

    protected _filterBrand() {
        if (!this.brandData) {
            return;
        }
        let search = this.brandFilter.value;
        if (!search) {
            this.filterBrand.next(this.brandData.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        this.filterBrand.next(
            this.brandData.filter(item => item.name.toLowerCase().indexOf(search) > -1)
        );
    }

    protected _filterBrandModel() {
        if (!this.brandModelData) {
            return;
        }
        let search = this.brandModelFilter.value;
        if (!search) {
            this.filterBrandModel.next(this.brandModelData.slice());
            return;
        } else {
            search = search.toLowerCase();

            console.log(1);

        }
        this.filterBrandModel.next(
            this.brandModelData.filter(item => item.name.toLowerCase().indexOf(search) > -1)
        );
    }

    protected _filterCar() {


        if (!this.productData) {
            return;
        }
        let search = this.productFilter.value;
        if (!search) {
            // this.filterProduct.next(this.productData.slice());
            return;
        } else {

            search = search.toString().toLowerCase();
        }
        this.filterProduct.next(
            this.productData.filter(item =>
                item.name.toLowerCase().includes(search)
            )
        );
    }

    protected _filterAccessrie() {
        if (!this.accessorieData) {
            return;
        }
        let search = this.accessorieFilter.value;
        if (!search) {
            this.filterAccessorie.next(this.accessorieData.slice());
            return;
        } else {
            search = search.toString().toLowerCase();
        }
        this.filterAccessorie.next(
            this.accessorieData.filter(item =>
                item.name.toLowerCase().includes(search)
            )
        );
    }

    protected _filterWorkStation() {
        if (!this.workstationData) {
            return;
        }
        let search = this.workstationFilter.value;
        if (!search) {
            this.filterWorkstation.next(this.workstationData.slice());
            return;
        } else {
            search = search.toString().toLowerCase();
        }
        this.filterWorkstation.next(
            this.workstationData.filter(item =>
                item.name.toLowerCase().includes(search) ||
                item.serial_no.toLowerCase().includes(search)
            )
        );
    }

    protected _filterMachineModel() {
        if (!this.mcData) {
            return;
        }
        let search = this.machineModelFilter.value;
        if (!search) {
            this.filterMachineModel.next(this.mcData.slice());
            return;
        } else {
            search = search.toString().toLowerCase();
        }
        this.filterMachineModel.next(
            this.mcData.filter(item =>
                item.name.toLowerCase().includes(search)
            )
        );
    }

    protected _filterClient() {
        if (!this.clientData) {
            return;
        }
        let search = this.clientFilter.value;
        if (!search) {
            this.filterClient.next(this.clientData.slice());
            return;
        } else {
            search = search.toString().toLowerCase();
        }
        this.filterClient.next(
            this.clientData.filter(item =>
                item.name.toLowerCase().includes(search)
            )
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

    protected _filterFinance() {

        if (!this.financeData) {
            return;
        }
        let search = this.financeFilter.value;
        if (!search) {
            this.filterFinance.next(this.financeData.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        this.filterSale.next(
            this.financeData.filter(item => item.name.toLowerCase().indexOf(search) > -1)
        );
    }

    get machine_models(): FormArray {
        return this.formData.get('machine_models') as FormArray;
    }

    addToMachineModels() {
        this.removeAllItems('machine_models')
        const machineModels = this.machine_models;
        // วนลูปเพิ่ม object ที่มี key product_id เข้าไปใน FormArray
        this.formData.value.memberIds.forEach(id => {
            machineModels.push(this._fb.group({ product_id: id }));
        });
    }
    addToTransducers() {
        this.removeAllItems('transducers')
        const machineModels = this.transducers;
        // วนลูปเพิ่ม object ที่มี key product_id เข้าไปใน FormArray
        this.formData.value.tds.forEach(id => {
            machineModels.push(this._fb.group({ product_id: id }));
        });
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
            this.formData.patchValue({
                user_id: selectedData.id,
            });
            this.saleFilter.setValue(selectedData?.name)
        } else {
            if (this.saleFilter.invalid) {

                this.saleFilter.markAsTouched(); // กำหนดสถานะ touched เพื่อแสดง mat-error
            }
            return;
        }
    }

    setValuesToFormArray(values: number[]): void {
        const formArray = this.transducers;
        values.forEach(value => {
            formArray.push(this._fb.control(value));
        });
    }

    setValuesToFormArray1(values: number[]): void {
        const formArray = this.machine_models;
        values.forEach(value => {
            formArray.push(this._fb.control(value));
        });
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
            this.formData.patchValue({
                product_id: selectedData.id,
            });
            let data = selectedData.name + ' ' + '[' + selectedData?.serial_no + ']'
            this.productFilter.setValue(data)
        } else {
            if (this.productFilter.invalid) {
                this.productFilter.markAsTouched();
            }
            return;
        }
    }

    onSelectWorkStation(event: any, type: any) {
        if (!event) {
            if (this.workstationFilter.invalid) {

                this.workstationFilter.markAsTouched(); // กำหนดสถานะ touched เพื่อแสดง mat-error
            }
            return;
        }
        const _value = event;
        const selectedData = this.workstationData.find(item => item.name === _value);
        if (selectedData) {
            this.formData.patchValue({
                work_station_id: selectedData.id,
            });
            let data = selectedData.name + ' ' + '[' + selectedData?.serial_no + ']'
            this.workstationFilter.setValue(data)
        } else {
            if (this.workstationFilter.invalid) {

                this.workstationFilter.markAsTouched(); // กำหนดสถานะ touched เพื่อแสดง mat-error
            }
            return;
        }
    }

    onSelectAccessorie(event: any, type: any) {
        if (!event) {
            if (this.accessorieFilter.invalid) {
                this.accessorieFilter.markAsTouched();
            }
            console.log('No sale');
            return;
        }
        const _value = event;
        const selectedData = this.accessorieData.find(item => item.name === _value);
        if (selectedData) {
            this.formData.patchValue({
                accessorie_id: selectedData.id,
            });
            let data = selectedData.name + ' ' + '[' + selectedData?.serial_no + ']'
            this.accessorieFilter.setValue(data)
        } else {
            if (this.accessorieFilter.invalid) {
                this.accessorieFilter.markAsTouched();
            }
            console.log('No sale');
            return;
        }
    }

    onSelectClient(event: any, type: any) {
        if (!event) {
            if (this.clientFilter.invalid) {

                this.clientFilter.markAsTouched();
            }
            console.log('No sale');
            return;
        }
        const _value = event;
        const selectedData = this.clientData.find(item => item.name === _value);
        if (selectedData) {
            this.formData.patchValue({
                client_id: selectedData.id,
            });
            let data = selectedData.name
            this.clientFilter.setValue(data)
        } else {
            if (this.clientFilter.invalid) {

                this.clientFilter.markAsTouched();
            }
            console.log('No sale');
            return;
        }
    }

    onSelectMachineModel(event: any,type: any) {
        console.log(type);

        const selectedName = event.option.value;
        const selected = this.mcData.find(item => item.name === selectedName);

        if (selected) {
            const existingItem = this.machine_models.controls.find(
                (control) => control.get('machine_model_id')?.value === selected.id
            );
            if (existingItem) {
                alert('เลือกเครื่องซ้ำ')
                this.machineModelFilter.setValue(null); // ล้างค่าในช่อง input
            } else {
                if (type === 'machine_models') {

                    let item = this._fb.group({
                        machine_model_id: selected.id,
                        machine_model_name: selected.name,
                        qty: 1,
                    });
                    this.machine_models.push(item)
                    this.machineModelFilter.setValue(null); // ล้างค่าในช่อง input
                } else {
                    let item = this._fb.group({
                        machine_model_id: selected.id,
                        machine_model_name: selected.name,
                        qty: 1,
                    });
                    this.transducers.push(item)
                    this.machineModelFilter.setValue(null); // ล้างค่าในช่อง input
                }
            }


        }
    }

    getFormFieldHelpersAsString(): string {
        return this.formFieldHelpers.join(' ');
    }

    onBack() {
        this._router.navigate(['admin/sales/list'])
    }

    onSubmit(): void {
        if (this.isForm === true) {
            const dialogRef = this._fuseConfirmationService.open({
                "title": "บันทึกข้อมูล",
                "message": "คุณต้องการบันทึกข้อมูลใช่หรือไม่ ?",
                "icon": {
                    "show": true,
                    "name": "heroicons_outline:exclamation-triangle",
                    "color": "accent"
                },
                "actions": {
                    "confirm": {
                        "show": true,
                        "label": "ตกลง",
                        "color": "primary"
                    },
                    "cancel": {
                        "show": true,
                        "label": "ยกเลิก"
                    }
                },
                "dismissible": true
            })
            dialogRef.afterClosed().subscribe((result => {
                if (result === 'confirmed') {
                    let formValue = this.formData.value;
                    formValue.start_date = DateTime.fromISO(this.formData.value.start_date).toFormat('yyyy-MM-dd')
                    formValue.end_date = DateTime.fromISO(this.formData.value.end_date).toFormat('yyyy-MM-dd')

                    this._service.create(formValue).subscribe({
                        next: (resp: any) => {
                            this._router.navigate(['admin/sales/list'])
                        },
                        error: (err: any) => {
                            this._fuseConfirmationService.open({
                                "title": "กรุณาระบุข้อมูล",
                                "message": err.error.message,
                                "icon": {
                                    "show": true,
                                    "name": "heroicons_outline:exclamation",
                                    "color": "warning"
                                },
                                "actions": {
                                    "confirm": {
                                        "show": false,
                                        "label": "ยืนยัน",
                                        "color": "primary"
                                    },
                                    "cancel": {
                                        "show": false,
                                        "label": "ยกเลิก",

                                    }
                                },
                                "dismissible": true
                            });
                        }
                    })
                } else {

                }
            }))
        } else {
            const dialogRef = this._fuseConfirmationService.open({
                "title": "บันทึกข้อมูล",
                "message": "คุณต้องการบันทึกข้อมูลใช่หรือไม่ ?",
                "icon": {
                    "show": true,
                    "name": "heroicons_outline:exclamation-triangle",
                    "color": "accent"
                },
                "actions": {
                    "confirm": {
                        "show": true,
                        "label": "ตกลง",
                        "color": "primary"
                    },
                    "cancel": {
                        "show": true,
                        "label": "ยกเลิก"
                    }
                },
                "dismissible": true
            })
            dialogRef.afterClosed().subscribe((result => {
                if (result === 'confirmed') {
                    let formValue = this.formData.value;
                    formValue.start_date = DateTime.fromISO(this.formData.value.start_date).toFormat('yyyy-MM-dd')
                    formValue.end_date = DateTime.fromISO(this.formData.value.end_date).toFormat('yyyy-MM-dd')
                    this._service.update(formValue, this.Id).subscribe({
                        next: (resp: any) => {
                            this._router.navigate(['admin/sales/list'])
                        },
                        error: (err: any) => {
                            this._fuseConfirmationService.open({
                                "title": "กรุณาระบุข้อมูล",
                                "message": err.error.message,
                                "icon": {
                                    "show": true,
                                    "name": "heroicons_outline:exclamation",
                                    "color": "warning"
                                },
                                "actions": {
                                    "confirm": {
                                        "show": false,
                                        "label": "ยืนยัน",
                                        "color": "primary"
                                    },
                                    "cancel": {
                                        "show": false,
                                        "label": "ยกเลิก",

                                    }
                                },
                                "dismissible": true
                            });
                        }
                    })
                } else {

                }
            }))
        }
    }

    removeAllItems(array: string) {
        if (array === 'machine_models') {
            const formArray = this.formData.get('machine_models') as FormArray;
            while (formArray.length !== 0) {
                formArray.removeAt(0);
            }
        } else {
            const formArray = this.formData.get('transducers') as FormArray;
            while (formArray.length !== 0) {
                formArray.removeAt(0);
            }
        }

    }

    openDialogProduct(type: any) {
        const dialogRef = this.dialog.open(ProductDialogComponent, {
            width: '800px',
            maxHeight: '90vh',
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (type === 'prod') {
                    this.productFilter.setValue(result.name)
                    this.formData.patchValue({
                        product_id: result.id
                    })
                } else if (type === 'acc') {
                    this.accessorieFilter.setValue(result.name)
                    this.formData.patchValue({
                        accessorie_id: result.id
                    })
                } else if (type === 'work') {
                    this.workstationFilter.setValue(result.name)
                    this.formData.patchValue({
                        work_station_id: result.id
                    })
                }

            }
        });
    }
    onCheckboxChange(event: any, item: any): void {
        if (event.checked) {
            this.selectedProducts.push(item);
            console.log(this.selectedProducts);


        } else {
            const index = this.selectedProducts.indexOf(item); if (index > -1) {
                this.selectedProducts.splice(index, 1);

            }
        }
    }

    isSelected(item: any): boolean {
        return this.selectedProducts.includes(item);
    }
    onSelectProduct1(value: any, source: string) {

    } // ฟังก์ชันนี้จะทำงานเมื่อมีการเลือกตัวเลือก console.log(value, source);


    selectionMemberChanged(data: any) {
        let temp_memberIds = data.filter(item => item !== '');
        const findAll = temp_memberIds.find(item => item === 'all');
        if (this.check_allmember == true) {
            this.check_allmember = false //ไม่เลือกทั้งหมด
            if (findAll === undefined) {
                this.formData.patchValue({
                    memberIds: ['']
                });
            } else {
                //let member_all = this.allmemberData.map(item => item.id)
                const new_selectedMember = temp_memberIds.filter(item => item != 'all');
                this.formData.patchValue({
                    memberIds: new_selectedMember
                });
            }
        } else if (findAll !== undefined && this.check_allmember == false) { // all ครั้งแรก
            this.check_allmember = true

            let member_all = this.productData.map(item => item.id)
            member_all.push('all')
            this.formData.patchValue({
                memberIds: member_all
            });
        } else {
            this.formData.patchValue({
                memberIds: temp_memberIds
            });
        }

        if (this.formData.value.memberIds.length == 0) {
            this.formData.patchValue({
                memberIds: ['']
            })
        }

    }

    memberData: any
    allmemberData: any
    check_allmember: boolean = false
    searchMemberChange(data: Event) {
        const inputValue = (data.target as HTMLInputElement).value;
        console.log('Input value changed:', inputValue);

        if (inputValue != '') {
            this.memberData = this.productData.filter(item => item.name?.toLowerCase().includes(inputValue.toLowerCase()))
            console.log('this.deviceData kub', inputValue, ' :: ', this.memberData)
        } else {
            this.memberData = this.productData
        }
    }

    selectionTDChanged(data: any) {
        let temp_memberIds = data.filter(item => item !== '');
        const findAll = temp_memberIds.find(item => item === 'all');
        if (this.check_alltd == true) {
            this.check_alltd = false //ไม่เลือกทั้งหมด
            if (findAll === undefined) {
                this.formData.patchValue({
                    tds: ['']
                });
            } else {
                //let member_all = this.allmemberData.map(item => item.id)
                const new_selectedMember = temp_memberIds.filter(item => item != 'all');
                this.formData.patchValue({
                    tds: new_selectedMember
                });
            }
        } else if (findAll !== undefined && this.check_alltd == false) { // all ครั้งแรก
            this.check_alltd = true

            let member_all = this.productData.map(item => item.id)
            member_all.push('all')
            this.formData.patchValue({
                tds: member_all
            });
        } else {
            this.formData.patchValue({
                tds: temp_memberIds
            });

        }

        if (this.formData.value.memberIds.length == 0) {
            this.formData.patchValue({
                tds: ['']
            })
        }



    }

    tdData: any
    alltdData: any
    check_alltd: boolean = false
    searchTDChange(data: Event) {
        const inputValue = (data.target as HTMLInputElement).value;
        console.log('Input value changed:', inputValue);

        if (inputValue != '') {
            this.tdData = this.productData.filter(item => item.name?.toLowerCase().includes(inputValue.toLowerCase()))
            console.log('this.deviceData kub', inputValue, ' :: ', this.tdData)
        } else {
            this.tdData = this.productData
        }
    }

    openDialogApprove(): void {
        this.dialog
            .open(ClaimDialogComponent, {
                maxHeight: '90vh',
                width: '700px',
                data: {
                    order: this.itemData
                },
            })
            .afterClosed()
            .subscribe(() => {
                // Go up twice because card routes are setup like this; "card/CARD_ID"
                // this._router.navigate(['./../..'], {relativeTo: this._activatedRoute});
            });
    }
}



