import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FuseValidators } from '@fuse/validators';
import { environment } from 'environments/environment.development';
import { catchError, concatMap, first, from, of, throwError } from 'rxjs';

@Component({
    selector       : 'profile-reset-password-dialog',
    templateUrl    : './reset-password-dialog.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
    ],
})
export class ProfileResetPasswordDialogComponent {
    form = this._formBuilder.group(
        {
            oldPassword    : ['', Validators.required],
            newPassword    : ['', Validators.required],
            confirmPassword: ['', Validators.required],
        },
        {
            validators: FuseValidators.mustMatch('newPassword', 'confirmPassword'),
        },
    );

    isSubmitting = false;
    hideOld = true;
    hideNew = true;
    hideConfirm = true;

    constructor(
        private _formBuilder: FormBuilder,
        private _httpClient: HttpClient,
        private _cdr: ChangeDetectorRef,
        private _dialogRef: MatDialogRef<ProfileResetPasswordDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { userId?: number | string } | null,
    ) {}

    close(): void {
        this._dialogRef.close(false);
    }

    submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this._cdr.markForCheck();
            return;
        }

        this.isSubmitting = true;
        this._cdr.markForCheck();

        const payload: any = {
            old_password: this.form.value.oldPassword,
            password: this.form.value.newPassword,
            password_confirmation: this.form.value.confirmPassword,
        };

        if (this.data?.userId !== undefined && this.data?.userId !== null) {
            payload.user_id = this.data.userId;
        }

        // รองรับหลาย endpoint เผื่อ backend ใช้ชื่อไม่เหมือนกัน
        const endpoints = ['/api/change_password', '/api/reset_password', '/api/update_password'];

        from(endpoints)
            .pipe(
                concatMap((path) =>
                    this._httpClient.post<any>(environment.baseURL + path, payload).pipe(
                        catchError((err) => {
                            // ถ้าไม่เจอ endpoint ลองตัวถัดไป
                            if (err?.status === 404 || err?.status === 405) {
                                return of(null);
                            }
                            return throwError(() => err);
                        }),
                    ),
                ),
                first((res) => res !== null, null),
                catchError((err) => throwError(() => err)),
            )
            .subscribe({
                next: (resp) => {
                    this.isSubmitting = false;
                    this._cdr.markForCheck();

                    if (resp === null) {
                        // endpoint ไม่ตรงกับ backend
                        this.form.setErrors({ endpointNotFound: true });
                        this._cdr.markForCheck();
                        return;
                    }

                    this._dialogRef.close(true);
                },
                error: (err) => {
                    this.isSubmitting = false;
                    this._cdr.markForCheck();

                    // แสดง error ที่ form แบบง่ายๆ
                    this.form.setErrors({ serverError: err?.error?.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' });
                    this._cdr.markForCheck();
                },
            });
    }
}
