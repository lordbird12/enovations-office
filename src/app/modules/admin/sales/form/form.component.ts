

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
import { distinctUntilChanged, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxMaskDirective } from 'ngx-mask';
import { MatRadioModule } from '@angular/material/radio';
import { CustomerDialogComponent } from '../customer-dialog/customer-dialog.component';
import { CarouselComponent } from '../image-slide/carousel.component';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
@Component({
    selector: 'form-product',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CarouselComponent,
        MatRadioModule,
        NgxMaskDirective,
        MatAutocompleteModule,
        CommonModule, MatIconModule, FormsModule, MatFormFieldModule, NgClass, MatInputModule, TextFieldModule, ReactiveFormsModule, MatButtonToggleModule, MatButtonModule, MatSelectModule, MatOptionModule, MatChipsModule, MatDatepickerModule],
})
export class FormComponent implements OnInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    fixedSubscriptInput: FormControl = new FormControl('', [Validators.required]);
    dynamicSubscriptInput: FormControl = new FormControl('', [Validators.required]);
    fixedSubscriptInputWithHint: FormControl = new FormControl('', [Validators.required]);
    dynamicSubscriptInputWithHint: FormControl = new FormControl('', [Validators.required]);
    isForm: boolean = true

    finanaceData: any[] = [];

    paymentData: any[] = [];
    claimData: any[] = [];
    userData: any[] = [];
    images: any[] = [];
    image: string = '';
    itemData: any;
    total: number;
    total1: number;
    Id: number;
    claimId: number;
    product_select: any;
    saleType: any[] = [
        {
            code: 'Installment_with_finance',
            name: 'ผ่อนชำระผ่านไฟแนนซ์'
        },
        {
            code: 'Installment_with_companie',
            name: 'ผ่อนชำระกับทางร้าน'
        },
        {
            code: 'Cash',
            name: 'เงินสด'
        },

    ];
    promotionData: any[] = [];
    repairType: any[] = [
        {
            code: 'IN',
            name: 'ช่างภายใน'
        },
        {
            code: 'OUT',
            name: 'ช่างภายนอก'
        },

    ];
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
    productFilter = new FormControl('');
    filterProduct: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    productData: any[] = [];

    ///workstationFilter
    workstationFilter = new FormControl('');
    filterWorkstation: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    workstationData: any[] = [];

    ///workstationFilter
    accessorieFilter = new FormControl('');
    filterAccessorie: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    accessorieData: any[] = [];

    ///workstationFilter
    clientFilter = new FormControl('');
    filterClient: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    clientData: any[] = [];

    user: any
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


        this.productData = this.activatedRoute.snapshot.data.products.data
        this.filterProduct.next(this.productData.slice());

        this.accessorieData = this.activatedRoute.snapshot.data.products.data
        this.filterAccessorie.next(this.accessorieData.slice());

        this.workstationData = this.activatedRoute.snapshot.data.products.data
        this.filterWorkstation.next(this.workstationData.slice());

        this.saleData = this.activatedRoute.snapshot.data.user.data
        this.filterSale.next(this.saleData.slice());

        this.clientData = this.activatedRoute.snapshot.data.client.data
        this.filterClient.next(this.clientData.slice());

        this.formData = this._fb.group({
            calendar_date: null,
            budget: 0,
            request_purpose: null,
            user_id: null,
            product_id: null,
            accessorie_id: null,
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
        });
    }

    addPromotion() {
        // this.setPromotions(data.data);
    }

    ngOnInit() {

        if (this._router.url !== '/admin/sales/form') {
            this.activatedRoute.params.subscribe(params => {
                this.isForm = false;
                const id = params.id;
                this.Id = id
                this._service.getById(id).subscribe((resp: any) => {
                    this.itemData = resp.data;
                    // const currentDateTime = DateTime.fromISO(this.itemData?.date)
                    // this.formattedDateTime = currentDateTime.toFormat('dd/MM/yyyy'
                    
                    
                    this.saleFilter.setValue(this.itemData.user?.name)
                    this.clientFilter.setValue(this.itemData.client?.name)
                    this.productFilter.setValue(this.itemData.product?.name)
                    this.accessorieFilter.setValue(this.itemData.product?.name)
                    this.workstationFilter.setValue(this.itemData.product?.name)
                    this.formData.patchValue({
                        ...this.itemData,
                    });
         

                    this._changeDetectorRef.markForCheck();
               
                });
            });
        } else {
            const currentDateTime = DateTime.now();
            this.formattedDateTime = currentDateTime.toFormat('dd/MM/yyyy');
            this.formData.patchValue({
                user_id: this.user_login?.id,
                calendar_date: currentDateTime.toFormat('yyyy-MM-dd')
            })
            this.saleFilter.setValue(this.user_login?.name)


            // this._service.getPromotion().subscribe((data) => {
            //     // this.setPromotions(data.data);
            //     this._changeDetectorRef.markForCheck();
            // });
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

            console.log(1);

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
            this.filterProduct.next(this.productData.slice());
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

    repairs(): FormArray {
        return this.formData.get('repairs') as FormArray;
    }

    createRepairsForm(): FormGroup {
        return this._fb.group({
            engineer_id: null,
            type: 'IN',
            detail: '',
        });
    }

    addRepair(): void {
        this.repairs().push(this.createRepairsForm());

    }

    removeRepair(i: number): void {
        this.repairs().removeAt(i);
    }

    promotions(): FormArray {
        return this.formData.get('promotion_lists') as FormArray;
    }

    createPromotionForm(promotion: any): FormGroup {
        return this._fb.group({
            discount_id: '',
            name: promotion?.discount?.name,
            amount: promotion?.discount?.amount
            // promotion_id: [promotion.id || ''],
            // name: promotion.name,
            // amount: 0,
            // paid: '1',
            // detail: '',
            // checked: false
        });
    }
    setPromotions(promotions: any[]) {

        console.log('promotion', promotions);

        const promotionFormArray = this.formData.get('promotion_lists') as FormArray;
        promotions.forEach(promotion => {
            console.log(promotion);

            promotionFormArray.push(this.createPromotionForm(promotion));
        });
    }

    onSelectSale(event: any, type: any) {
        if (!event) {
            if (this.saleFilter.invalid) {

                this.saleFilter.markAsTouched(); // กำหนดสถานะ touched เพื่อแสดง mat-error
            }
            console.log('No sale');
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
            console.log('No sale');
            return;
        }
    }

    onSelectProduct(event: any, type: any) {
        if (!event) {
            if (this.productFilter.invalid) {

                this.productFilter.markAsTouched(); // กำหนดสถานะ touched เพื่อแสดง mat-error
            }
            console.log('No sale');
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

                this.productFilter.markAsTouched(); // กำหนดสถานะ touched เพื่อแสดง mat-error
            }
            console.log('No sale');
            return;
        }
    }

    onSelectWorkStation(event: any, type: any) {
        if (!event) {
            if (this.workstationFilter.invalid) {

                this.workstationFilter.markAsTouched(); // กำหนดสถานะ touched เพื่อแสดง mat-error
            }
            console.log('No sale');
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
            console.log('No sale');
            return;
        }
    }

    onSelectAccessorie(event: any, type: any) {
        if (!event) {
            if (this.accessorieFilter.invalid) {

                this.accessorieFilter.markAsTouched(); // กำหนดสถานะ touched เพื่อแสดง mat-error
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

                this.accessorieFilter.markAsTouched(); // กำหนดสถานะ touched เพื่อแสดง mat-error
            }
            console.log('No sale');
            return;
        }
    }

    onSelectClient(event: any, type: any) {
        if (!event) {
            if (this.clientFilter.invalid) {

                this.clientFilter.markAsTouched(); // กำหนดสถานะ touched เพื่อแสดง mat-error
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

                this.clientFilter.markAsTouched(); // กำหนดสถานะ touched เพื่อแสดง mat-error
            }
            console.log('No sale');
            return;
        }
    }





    getFormFieldHelpersAsString(): string {
        return this.formFieldHelpers.join(' ');
    }

    onBack() {
        this._router.navigate(['admin/sales/list'])
    }

    selectProduct(item: any): void {
        this.formData.patchValue({

        })
        let data = {
            brand_model: item.brand?.name + '/' + item.brand_model?.name,
            year: item.year,
            color: item.color?.name,
            gear: item.gear,
            license_plete: item.license_plate,
            engine_no: item.engine_no,
            tank_no: item.tank_no,
        }

        if (item.images) {
            item.images.forEach(element => {
                let _images = {
                    url: element.image,
                    alt: element.id
                }
                this.images.push(_images)
            })

        }
        this.image = item._images
        this.productSelected = data
        this.productFilter.setValue(item.license_plate + ',' + item.name)
        this._changeDetectorRef.markForCheck();

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
                    formValue.calendar_date = moment(formValue.calendar_date).format('YYYY-MM-DD')
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
                    formValue.calendar_date = moment(formValue.calendar_date).format('YYYY-MM-DD')
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

    payment() {
        const dialogRef = this.dialog.open(EditDialogComponent, {
            width: '500px', // กำหนดความกว้างของ Dialog
            data: {
                data: this.itemData.id,
            } // ส่งข้อมูลเริ่มต้นไปยัง Dialog
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._service.getById(this.Id).subscribe((resp: any) => {
                    this.itemData = resp.data;
                    this.paymentData = resp.data.orders.payments;
                    this.total = this.paymentData.reduce((sum, current) => sum + (+current.price), 0);
                    this.formData.patchValue({
                        ...this.itemData,
                    });
                });
            }
        });
    }
    customer(value: any) {
        const dialogRef = this.dialog.open(CustomerDialogComponent, {
            width: '800px',
            height: '800px',
            data: {
                type: value
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.formData.patchValue({
                    client_id: result.id,
                    customer_name: result.name ?? null,
                    phone: result.phone ?? null,
                    idcard: result.idcard ?? null,
                    address: result.address ?? null,
                    type: result.type ?? null,
                })
            }
        });
    }

    openDialogProduct(type: any) {
        const dialogRef = this.dialog.open(ProductDialogComponent, {
            width: '800px',
            height: '800px',
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if(type === 'prod') {
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

    showPicture(imgObject: any): void {
        console.log(imgObject)
        this.dialog
            .open(PictureComponent, {
                autoFocus: false,
                data: {
                    imgSelected: environment.baseURL + imgObject,
                },
            })
            .afterClosed()
            .subscribe(() => {
                // Go up twice because card routes are setup like this; "card/CARD_ID"
                // this._router.navigate(['./../..'], {relativeTo: this._activatedRoute});
            });
    }
    formatNumber() {

        let value = this.formData.get('sale_price')?.value;


        if (value) {
            // Remove commas if any
            value = value.replace(/,/g, '');
            // Convert to number and then format
            const formattedValue = new Intl.NumberFormat().format(value);
            this.formData.get('sale_price')?.setValue(formattedValue);
        }
    }
    
    changeDate() {
        let formValue = this.formData.value.calendar_date
        this.formattedDateTime = moment(formValue.calendar_date).format('YYYY-MM-DD')
        this._changeDetectorRef.markForCheck()
    }

    onInputChange(event: any) {

        // Remove all characters except numbers
        let value = event.target.value.replace(/[^0-9]/g, '');
        // Format as currency
        const formattedValue = new Intl.NumberFormat().format(value);
        console.log(formattedValue);

        this.formData.get('sale_price')?.setValue(formattedValue);
        // console.log(this.formData.value.sale_price);

    }

    onSelectedPromotion(event: any) {

        let data = this.promotionData.find(item => item.id === event)
        const promotionFormArray = this.formData.get('promotion_lists') as FormArray;
        // เคลียร์ข้อมูลใน FormArray
        while (promotionFormArray.length !== 0) {
            promotionFormArray.removeAt(0);
        }
        data.promotion_lists.forEach(promotion => {
            let promo = this._fb.group({
                discount_id: [promotion.discount.id || ''],
                name: promotion.discount.name,
                amount: promotion.discount.amount,
                status: 'Y'
            });
            promotionFormArray.push(promo);
        });
        this.formData.patchValue({
            promotion_id: event
        })
    }
    zoomedImage: { url: string; alt: string } | null = null;
    zoomImage(image: { url: string; alt: string }) {
        this.zoomedImage = image;
    }

    closeZoom() {
        this.zoomedImage = null;
    }

}


