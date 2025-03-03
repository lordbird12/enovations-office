import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { PageService } from '../page.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, NgClass } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule, ThemePalette } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';

@Component({
    selector: 'app-team-dialog',
    templateUrl: './team-dialog.component.html',
    styleUrls: ['./team-dialog.component.scss'],
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
        MatPaginatorModule,
        MatTableModule,
        MatRadioModule,
        CommonModule,
        MatSlideToggleModule,
        MatCardModule,
        DataTablesModule
    ],
})
export class TeamDialogComponent implements OnInit {
    @ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;
    isLoading: boolean = false;
    dtOptions: DataTables.Settings = {};
    positions: any[];
    // public dataRow: any[];
    dataRow: any[] = [];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    flashMessage: 'success' | 'error' | null = null;
    editForm: FormGroup;
    status: any[] = [
        {
            id: 1,
            name: 'เปิดใช้งาน'
        }, {
            id: 0,
            name: 'ไม่เปิดใช้งาน'
        },
    ];
    color: ThemePalette = 'primary';
    checked = false;
    disabled = false;
    product: any[] = [
    ];

    isInputDisabled: boolean = true;
    constructor(private dialogRef: MatDialogRef<TeamDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: PageService
    ) {
        this.editForm = this.formBuilder.group({
            id: [],
            name: [],
            detail: [],
            products: this.formBuilder.array([]),
        });
        this._service.get_category_product().subscribe((resp: any) => {
            this.product = Array.isArray(resp) ? resp : resp.data || [];
        })

    }

    ngOnInit(): void {
        console.log(this.data.data);
        
        this.loadTable(this.data.data);
    }

    pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 };
    loadTable(id): void {
        const that = this;
        this.dtOptions = {
            pagingType: "full_numbers",
            pageLength: 25,
            serverSide: true,
            processing: true,
            language: {
                url: "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json",
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.team_id = id;
                that._service.getTeamPage(dataTablesParameters).subscribe((resp: any) => {
                    this.dataRow = resp.data;
                    this.pages.current_page = resp.current_page;
                    this.pages.last_page = resp.last_page;
                    this.pages.per_page = resp.per_page;
                    if (parseInt(resp.current_page) > 1) {
                        this.pages.begin = parseInt(resp.per_page) * (parseInt(resp.current_page) - 1);
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

    // ฟังก์ชันสำหรับการเพิ่ม factory จาก checkbox
    addProducts(id: number) {
        const products = this.editForm.get('products') as FormArray;

        // ตรวจสอบว่า factoryId มีอยู่ใน FormArray หรือไม่
        const index = products.value.findIndex((value: any) => value.product_id === id);

        if (index === -1) {
            const value = this.formBuilder.group({
                product_id: id,
            });
            products.push(value);
        } else {
            // ถ้ามีอยู่แล้วให้ลบออก
            products.removeAt(index);
        }
    }

    isFactoryChecked(product_id: number): boolean {
        const productsFormArray = this.editForm.get('products') as FormArray;
        return productsFormArray.value.some((value: any) => value.product_id === product_id);
    }

    onSaveClick(): void {
        this.flashMessage = null;
        // this.flashErrorMessage = null;
        // Return if the form is invalid
        if (this.editForm.invalid) {
            this.editForm.enable();
            this._fuseConfirmationService.open({
                "title": "กรุณาระบุข้อมูล",
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

            return;
        }
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            "title": "แก้ไขข้อมูล",
            "message": "คุณต้องการแก้ไขข้อมูลใช่หรือไม่ ",
            "icon": {
                "show": false,
                "name": "heroicons_outline:exclamation",
                "color": "warning"
            },
            "actions": {
                "confirm": {
                    "show": true,
                    "label": "ยืนยัน",
                    "color": "primary"
                },
                "cancel": {
                    "show": true,
                    "label": "ยกเลิก"
                }
            },
            "dismissible": true
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                const updatedData = this.editForm.value;
                this._service.update(updatedData, updatedData.id).subscribe({
                    next: (resp: any) => {
                        this.showFlashMessage('success');
                        this.dialogRef.close(resp);
                    },
                    error: (err: any) => {
                        this.editForm.enable();
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
            }
        })


        // แสดง Snackbar ข้อความ "complete"

    }

    onCancelClick(): void {

        this.dialogRef.close();
    }

    showFlashMessage(type: 'success' | 'error'): void {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {

            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }

    deleteTeam(itemid: any) {
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
                this._service.deleteTeam(itemid).subscribe((resp) => {
                    this.rerender();
                });
            }
            error: (err: any) => { };
        });
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }
}
