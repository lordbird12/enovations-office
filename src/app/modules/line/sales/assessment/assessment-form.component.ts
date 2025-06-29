import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DateTime } from 'luxon';
import { PageService } from '../page.service';

@Component({
    selector: 'app-assessment-form',
    templateUrl: './assessment-form.component.html',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatRadioModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule
    ]
})
export class AssessmentFormComponent implements OnInit {
    form: FormGroup
    Id: any;
    constructor(
        private fb: FormBuilder,
        private location: Location,
        private _activatedRoute: ActivatedRoute,
        private _fuseConfirmationService: FuseConfirmationService,
        private _service: PageService,
        private _router: Router
    ) {
        this.Id = this._activatedRoute.snapshot.params.id
        this.form = this.fb.group({
            order_id: this.Id,
            status: 'Win',
            note: ''
        })
    }

    ngOnInit(): void {

    }





    goBack() {
        // Implement your back navigation logic here
        this.location.back(); // Example using Location service
    }

    onSubmit(): void {
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
                let formValue = this.form.value;
                this._service.createWinLost(formValue).subscribe({
                    next: (resp: any) => {
                        this._router.navigate(['line/list/booking'])
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
