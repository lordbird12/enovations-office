import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { PageService } from '../page.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { NgxDropzoneModule } from 'ngx-dropzone';

@Component({
    selector: 'app-form-dialog-broker',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.scss'],
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
        NgxDropzoneModule
    ],
})
export class FormDialogComponent implements OnInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    addForm: FormGroup;
    isLoading: boolean = false;
    positions: any[];
    flashMessage: 'success' | 'error' | null = null;
    url_image: string;
    constructor(private dialogRef: MatDialogRef<FormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,
        private _service: PageService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {

        if (this.data) {
            this._service.getById(this.data.data?.id).subscribe((resp: any) => { })
        }

        this.addForm = this.formBuilder.group({
            id: '',
            companie_id: '',
            name: [],
            detail: '',
            image: [],
            status: '',
        });
    }

    ngOnInit(): void {

        if (this.data) {
            this.addForm.patchValue({
                ...this.data.data,
                companie_id: this.data.companie_id,
                image: ''
            })
            this.url_image = this.data.data?.image ?? '';
        } else {
            this.addForm.patchValue({
                companie_id: this.data.companie_id
            })
        }
    }

    onSaveClick(): void {
        this.flashMessage = null;
        // Open the confirmation dialog
        if (this.data.data) {
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
                    const formData = new FormData();
                    Object.entries(this.addForm.value).forEach(([key, value]: any[]) => {
                        formData.append(key, value);
                    });

                    for (var i = 0; i < this.files.length; i++) {
                        formData.append('image', this.files[i]);
                    }
                    this._service.updateArea(formData).subscribe({
                        next: (resp: any) => {
                            this.showFlashMessage('success');
                            this.dialogRef.close(resp);
                        },
                        error: (err: any) => {
                            this.addForm.enable();
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
        } else {
            const confirmation = this._fuseConfirmationService.open({
                "title": "เพิ่มข้อมูล",
                "message": "คุณต้องการเพิ่มข้อมูลใช่หรือไม่ ",
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

                    const formData = new FormData();
                    Object.entries(this.addForm.value).forEach(([key, value]: any[]) => {
                        formData.append(key, value);
                    });

                    for (var i = 0; i < this.files.length; i++) {
                        formData.append('image', this.files[i]);
                    }
                    this._service.createArea(formData).subscribe({
                        next: (resp: any) => {
                            this.showFlashMessage('success');
                            this.dialogRef.close(resp);
                        },
                        error: (err: any) => {
                            this.addForm.enable();
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
        }





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

    files: File[] = [];
    onSelect(event: { addedFiles: File[] }): void {
        this.files.push(...event.addedFiles);
        this.url_image = null;

    }

    onRemove(file: File): void {
        const index = this.files.indexOf(file);
        this.url_image = this.data.data?.image;
        if (index >= 0) {
            this.files.splice(index, 1);
        }
    }
    
    
}
