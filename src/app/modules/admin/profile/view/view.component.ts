import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ProfileResetPasswordDialogComponent } from '../reset-password-dialog/reset-password-dialog.component';

type ProfileTeam = {
    id?: number;
    name?: string;
    detail?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
};

export type ProfileUser = {
    id?: number;
    user_no?: string;
    user_id?: string;
    image?: string;
    permission_id?: number | string;
    department_id?: number | string;
    position_id?: number | string;
    username?: string;
    name?: string;
    email?: string;
    phone?: string;
    status?: string;
    team_id?: number | string;
    team_role?: string;
    create_by?: string;
    update_by?: string | null;
    created_at?: string;
    updated_at?: string;
    team?: ProfileTeam | null;
};

function safeJsonParse<T>(raw: string | null): T | null {
    if (!raw) return null;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
}

@Component({
    selector       : 'profile-view',
    templateUrl    : './view.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [CommonModule, MatIconModule, MatButtonModule, MatChipsModule, MatDividerModule, MatDialogModule],
})
export class ViewComponent implements OnInit {
    isLoaded = false;
    user: ProfileUser | null = null;

    constructor(
        private _router: Router,
        private _dialog: MatDialog,
        private _fuseConfirmationService: FuseConfirmationService,
    ) {}

    ngOnInit(): void {
        this.reload();
    }

    reload(): void {
        this.user = safeJsonParse<ProfileUser>(localStorage.getItem('user'));
        this.isLoaded = true;
    }

    goEdit(): void {
        this._router.navigate(['/admin/profile/edit']);
    }

    openResetPassword(): void {
        const userId = this.user?.id;
        this._dialog
            .open(ProfileResetPasswordDialogComponent, {
                width: '520px',
                autoFocus: false,
                data: { userId },
            })
            .afterClosed()
            .subscribe((ok: boolean) => {
                if (ok) {
                    this._fuseConfirmationService.open({
                        title: 'สำเร็จ',
                        message: 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว',
                        icon: { show: true, name: 'heroicons_outline:check-circle', color: 'success' },
                        actions: { confirm: { show: true, label: 'ตกลง', color: 'primary' }, cancel: { show: false, label: 'ยกเลิก' } },
                        dismissible: true,
                    });
                }
            });
    }

    onImageError(event: Event): void {
        const target = event.target as HTMLImageElement;
        if (target.src.includes('assets/images/no_image.png')) {
            return;
        }
        target.src = 'assets/images/no_image.png';
    }

    get teamName(): string {
        return this.user?.team?.name || '-';
    }

    get statusLabel(): string {
        const raw = (this.user?.status ?? '').toString().trim();
        if (!raw) return '-';
        return raw;
    }

    get statusColorClass(): string {
        const s = (this.user?.status ?? '').toString().toLowerCase();
        if (s === 'yes' || s === 'active' || s === 'online') return 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400';
        if (s === 'no' || s === 'inactive' || s === 'disabled') return 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400';
        return 'bg-gray-100 text-gray-800 dark:bg-gray-500/10 dark:text-gray-300';
    }

    valueOrDash(value: unknown): string {
        if (value === null || value === undefined) return '-';
        const s = String(value).trim();
        return s ? s : '-';
    }
}
