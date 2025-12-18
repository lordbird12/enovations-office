import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { environment } from 'environments/environment.development';
import { HttpClient } from '@angular/common/http';

import { ProfileUser } from '../view/view.component';

function safeJsonParse<T>(raw: string | null): T | null {
    if (!raw) return null;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
}

@Component({
    selector       : 'profile-edit',
    templateUrl    : './edit.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatDividerModule,
        NgxDropzoneModule,
    ],
})
export class EditComponent implements OnInit {
    form: FormGroup;

    user: ProfileUser | null = null;
    isLoading = false;

    files: File[] = [];
    urlImage: string | null = null;

    constructor(
        private _formBuilder: FormBuilder,
        private _httpClient: HttpClient,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService,
        private _cdr: ChangeDetectorRef,
    ) {
        this.form = this._formBuilder.group({
            name : ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: [''],
            image: [null],
        });
    }

    ngOnInit(): void {
        this.user = safeJsonParse<ProfileUser>(localStorage.getItem('user'));

        this.form.patchValue({
            name : this.user?.name ?? '',
            email: this.user?.email ?? '',
            phone: this.user?.phone ?? '',
            image: null,
        });

        this.urlImage = this.user?.image ?? null;
        this._cdr.markForCheck();
    }

    onSelect(event: { addedFiles: File[] }): void {
        this.files = [...this.files, ...event.addedFiles].slice(-1);
        const file = this.files[0];
        if (!file) return;

        this.form.patchValue({ image: file });

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e: any) => {
            this.urlImage = e.target.result;
            this._cdr.markForCheck();
        };
    }

    onRemove(file: File): void {
        this.files = this.files.filter((f) => f !== file);
        this.form.patchValue({ image: null });
        this.urlImage = this.user?.image ?? null;
        this._cdr.markForCheck();
    }

    onImageError(event: Event): void {
        const target = event.target as HTMLImageElement;
        if (target.src.includes('assets/images/no_image.png')) {
            return;
        }
        target.src = 'assets/images/no_image.png';
    }

    cancel(): void {
        this._router.navigate(['/admin/profile']);
    }

    save(): void {
        if (!this.user) {
            this._fuseConfirmationService.open({
                title: 'ไม่พบข้อมูลผู้ใช้',
                message: 'กรุณาเข้าสู่ระบบใหม่อีกครั้ง',
                icon: { show: true, name: 'heroicons_outline:exclamation-triangle', color: 'warning' },
                actions: { confirm: { show: true, label: 'ตกลง' }, cancel: { show: false, label: 'ยกเลิก' } },
                dismissible: true,
            });
            return;
        }

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this._cdr.markForCheck();
            return;
        }

        const confirmation = this._fuseConfirmationService.open({
            title: 'บันทึกโปรไฟล์',
            message: 'คุณต้องการบันทึกข้อมูลโปรไฟล์ใช่หรือไม่ ?',
            icon: { show: false, name: 'heroicons_outline:exclamation', color: 'warning' },
            actions: {
                confirm: { show: true, label: 'ยืนยัน', color: 'primary' },
                cancel : { show: true, label: 'ยกเลิก' },
            },
            dismissible: true,
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result !== 'confirmed') return;

            this.isLoading = true;
            this._cdr.markForCheck();

            const payload: any = {
                ...this.user,
                name : this.form.value.name,
                email: this.form.value.email,
                phone: this.form.value.phone,
            };

            // Backend นี้ใช้ update_user แบบ FormData
            const formData = new FormData();
            Object.entries(payload).forEach(([key, value]) => {
                if (value === undefined || value === null) {
                    return;
                }
                // ไม่ส่ง object (เช่น team) เข้าไปตรงๆ
                if (typeof value === 'object' && !(value instanceof File)) {
                    return;
                }
                formData.append(key, value as any);
            });

            // รูปใหม่ (ถ้ามี)
            if (this.form.value.image instanceof File) {
                formData.set('image', this.form.value.image);
            } else {
                // ส่งค่าว่างเพื่อให้ backend ไม่เปลี่ยนรูป (pattern เดิมใน employee)
                formData.set('image', '');
            }

            this._httpClient
                .post<any>(environment.baseURL + '/api/update_user', formData)
                .subscribe({
                    next: (resp) => {
                        const updatedUser = resp?.data ?? payload;
                        localStorage.setItem('user', JSON.stringify(updatedUser));

                        this.isLoading = false;
                        this._cdr.markForCheck();

                        this._router.navigate(['/admin/profile']);
                    },
                    error: (err) => {
                        this.isLoading = false;
                        this._cdr.markForCheck();

                        this._fuseConfirmationService.open({
                            title: 'บันทึกไม่สำเร็จ',
                            message: err?.error?.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
                            icon: { show: true, name: 'heroicons_outline:exclamation-triangle', color: 'warning' },
                            actions: { confirm: { show: true, label: 'ตกลง', color: 'primary' }, cancel: { show: false, label: 'ยกเลิก' } },
                            dismissible: true,
                        });
                    },
                });
        });
    }
}
