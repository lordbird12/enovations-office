import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AuthService } from 'app/core/auth/auth.service';
import { Service } from '../page.service';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { forkJoin, lastValueFrom } from 'rxjs';
import { MatRadioModule } from '@angular/material/radio';
import { J } from '@fullcalendar/core/internal-common';

@Component({
    selector: 'form-product',
    templateUrl: './form.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
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
        CommonModule,
        NgxDropzoneModule,
        MatRadioModule
    ],
})
export class FormComponent implements OnInit, AfterViewInit, OnDestroy {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    item1Data: any = [];
    item2Data: any = [];
    subCategory: any = [];
    itemSupplier: any = [];

    itemBrand: any = [];
    itemBrandModel: any = [];
    itemCC: any = [];
    itemColor: any = [];

    formData: FormGroup;
    formData2: FormGroup;
    user: any
    files: File[] = [];
    files1: File[] = [];
    files2: File[] = [];
    status: any[] = [
        {
            id: "0",
            name: 'ไม่มี VAT'
        },
        {
            id: "1",
            name: 'มี VAT'
        },
    ];
    warehouseData: any;
    companie: any;
    Id: any
    itemData: any
    category: any
    area: any
    brand: any
    machineModel: any
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _Service: Service,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService
    ) {
        this.user = JSON.parse(localStorage.getItem('user'))
        this.Id = this._activatedRoute.snapshot.paramMap.get('id');
        this.category = this._activatedRoute.snapshot.data.category.data
        this.area = this._activatedRoute.snapshot.data.area.data
        this.brand = this._activatedRoute.snapshot.data.brand.data
        this.machineModel = this._activatedRoute.snapshot.data.machineModel.data
        
        
        this.formData = this._formBuilder.group({
            id: null,
            category_product_id: ['', Validators.required],
            name: [''],
            code: [''],
            detail: [''],
            brand_id: [''],
            serial_no: [''],
            machine_model_id: [''],
            images: [''],
            area_id: [''],
            status: '',
            book: '',
            qty: '',
            machine_type: ['machine']

        });
    
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    async ngOnInit(): Promise<void> {
        if (this.Id) {
            this._Service.getById(this.Id).subscribe((resp: any) => {
                this.itemData = resp.data
                // console.log(this.itemData);
                this.formData.patchValue({
                    ...this.itemData,
                    category_product_id: +this.itemData.category_product_id,
                    area_id: +this.itemData.area_id,
                    brand_id: +this.itemData.brand_id,
                    machine_model_id: +this.itemData.machine_model_id,
                    images: [],
                })

            })
        }






    }

    /**
     * After view init
     */
    ngAfterViewInit(): void { }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
    }

    getCategories(): void {
        this._Service.getCategories().subscribe((resp) => {
            this.item1Data = resp.data;
        });
    }
    getSubCategories(): void {
        this._Service.getSubCategory().subscribe((resp) => {
            this.subCategory = resp.data;
            console.log();
            
        });
    }


    getSuppliers(): void {
        this._Service.getSuppliers().subscribe((resp) => {
            this.itemSupplier = resp.data;
        });
    }

    getBrand(): void {
        this._Service.getBrand().subscribe((resp) => {
            this.itemBrand = resp.data;
        });
    }
    getCompanie(): void {
        this._Service.getCompanie().subscribe((resp) => {
            this.companie = resp.data;
        });
    }

    getBrandModel(id: any): void {
        this._Service.getBrandModel(id).subscribe((resp) => {
            this.itemBrandModel = resp.data;
        });
    }

    getCC(): void {
        this._Service.getCC().subscribe((resp) => {
            this.itemCC = resp.data;
        });
    }

    getColor(): void {
        this._Service.getColor().subscribe((resp) => {
            this.itemColor = resp.data;
        });
    }

    /**
     * Get the form field helpers as string
     */
    getFormFieldHelpersAsString(): string {
        return this.formFieldHelpers.join(' ');
    }

    // somethingChanged(event: any): void {
    //     this.item2Data = event.value;
    // }

    somethingBrandChanged(event: any): void {
        this.itemBrand = event.value;
    }

    somethingBrandModelChanged(event: any): void {
        this.itemBrandModel = event.value;
    }

    somethingCCChanged(event: any): void {
        this.itemCC = event.value;
    }

    somethingColorChanged(event: any): void {
        this.itemColor = event.value;
    }
    areas: any[] = [];
    somethingCompanie(event: any): void {
        const item = this.companie.find(item => item.id === event.value);
        this.areas = item.areas


    }




    onSelect(event: any) {
        this.files.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
        }, 150);
    }

    onSelect1(event: any) {
        this.files1.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
        }, 150);
    }

    onSelect2(event: any) {
        this.files2.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
        }, 150);
    }

    onRemove(event: any) {
        this.files.splice(this.files.indexOf(event), 1);
    }

    onRemove1(event: any) {
        this.files1.splice(this.files1.indexOf(event), 1);
    }

    onRemove2(event: any) {
        this.files2.splice(this.files2.indexOf(event), 1);
    }


    New(): void {
        // Function to prepare formData
        const prepareFormData = (): FormData => {
            const formData = new FormData();
            Object.entries(this.formData.value).forEach(([key, value]: any[]) => {
                formData.append(key, value);
            });

            // Append images
            this.files.forEach((file) => {
                formData.append('image', file);
            });

            // Append additional images
            this.files1.forEach((file) => {
                formData.append('images[]', file);
            });

            // Append videos
            this.files2.forEach((file) => {
                formData.append('video', file);
            });

            return formData;
        };

        if (this.Id) {
            const confirmation = this._fuseConfirmationService.open({
                title: "แก้ไขข้อมูล",
                message: "คุณต้องการแก้ไขข้อมูลใช่หรือไม่ ",
                icon: {
                    show: false,
                    name: "heroicons_outline:exclamation",
                    color: "warning"
                },
                actions: {
                    confirm: {
                        show: true,
                        label: "ยืนยัน",
                        color: "primary"
                    },
                    cancel: {
                        show: true,
                        label: "ยกเลิก"
                    }
                },
                dismissible: true
            });

            // Subscribe to the confirmation dialog closed action
            confirmation.afterClosed().subscribe((result) => {
                if (result === 'confirmed') {
                    const formData = prepareFormData();
                    this._Service.update(formData).subscribe({
                        next: (resp: any) => {
                            this._router.navigate(['admin/product/list']);
                        },
                        error: (err: any) => {
                            this.formData.enable();
                            this._fuseConfirmationService.open({
                                title: "กรุณาระบุข้อมูล",
                                message: err.error.message,
                                icon: {
                                    show: true,
                                    name: "heroicons_outline:exclamation",
                                    color: "warning"
                                },
                                actions: {
                                    confirm: {
                                        show: false,
                                        label: "ยืนยัน",
                                        color: "primary"
                                    },
                                    cancel: {
                                        show: false,
                                        label: "ยกเลิก"
                                    }
                                },
                                dismissible: true
                            });
                        }
                    });
                }
            });
        } else {
            const confirmation = this._fuseConfirmationService.open({
                title: "เพิ่มข้อมูล",
                message: "คุณต้องการเพิ่มข้อมูลใช่หรือไม่ ",
                icon: {
                    show: false,
                    name: "heroicons_outline:exclamation",
                    color: "warning"
                },
                actions: {
                    confirm: {
                        show: true,
                        label: "ยืนยัน",
                        color: "primary"
                    },
                    cancel: {
                        show: true,
                        label: "ยกเลิก"
                    }
                },
                dismissible: true
            });

            // Subscribe to the confirmation dialog closed action
            confirmation.afterClosed().subscribe((result) => {
                if (result === 'confirmed') {
                    const formData = prepareFormData();
                    this._Service.create(formData).subscribe({
                        next: (resp: any) => {
                            this._router.navigate(['admin/product/list']);
                        },
                        error: (err: any) => {
                            this.formData.enable();
                            this._fuseConfirmationService.open({
                                title: "กรุณาระบุข้อมูล",
                                message: err.error.message,
                                icon: {
                                    show: true,
                                    name: "heroicons_outline:exclamation",
                                    color: "warning"
                                },
                                actions: {
                                    confirm: {
                                        show: false,
                                        label: "ยืนยัน",
                                        color: "primary"
                                    },
                                    cancel: {
                                        show: false,
                                        label: "ยกเลิก"
                                    }
                                },
                                dismissible: true
                            });
                        }
                    });
                }
            });
        }
    }


    backTo() {
        this._router.navigate(['admin/product/list'])
    }

}
