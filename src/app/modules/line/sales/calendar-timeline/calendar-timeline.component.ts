import { CommonModule, Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Router, ActivatedRoute } from '@angular/router';
import { DateTime } from 'luxon';
import { PageService } from '../page.service';
import liff from '@line/liff';
import { firstValueFrom, timeout } from 'rxjs';
import { LineService } from '../../line.service';

interface TimelineEvent {
    id: number;
    title: string;
    start: string; // 'YYYY-MM-DD'
    end: string;   // 'YYYY-MM-DD'
    color?: string;
}

@Component({
    selector: 'app-calendar-timeline',
    templateUrl: './calendar-timeline.component.html',
    styleUrls: ['./calendar-timeline.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatFormFieldModule,
    ]
})
export class CalendarTimelineComponent implements OnInit {
    timelineEvents: TimelineEvent[] = [];
    months: string[] = [];
    displayMonthCount = 6;
    user: any;
    groupedTimelineEvents: { [month: string]: any[] } = {};
    userIdFromLine: string = '';
    displayName: string = '';
    pictureUrl: string = '';
    selectedYear: number = new Date().getFullYear();
    allYears: number[] = []; // เช่น [2023, 2024, 2025]
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: PageService,
        private _router: Router,
        private _activated: ActivatedRoute,
        private location: Location,
        private _lineService: LineService
    ) {

    }


    async ngOnInit(): Promise<void> {


        try {
            // 🔸 1. Init LIFF
            await liff.init({ liffId: '2007657331-oyjNGORd' });

            // // 🔸 2. ถ้ายังไม่ login → login แล้วกลับมาหน้าเดิม
            if (!liff.isLoggedIn()) {
                liff.login({ redirectUri: window.location.href });
                return;
            }

            // 🔸 3. login แล้ว → get profile
            const profile = await liff.getProfile();
            this.userIdFromLine = profile.userId;
            this.displayName = profile.displayName;
            this.pictureUrl = profile.pictureUrl;

            // this.userIdFromLine = 'U2a2bcd2365d0be23f9ab13e75bd82717';
            // ✅ Debug
            console.log('LINE userId:', this.userIdFromLine);

            // 🔸 4. เรียก login API
            const resp: any = await firstValueFrom(
                this._lineService.lineLogin(this.userIdFromLine).pipe(timeout(1000))
            );
            localStorage.setItem('user', JSON.stringify(resp.data));
            localStorage.setItem('token', resp.token);
            const currentYear = new Date().getFullYear();
            for (let y = currentYear - 2; y <= currentYear + 2; y++) {
                this.allYears.push(y);
            }
            this.generateMonths();
            this.loadEvents();

            this._changeDetectorRef.markForCheck();

        } catch (err) {
            console.error('❌ LINE Login Failed:', err);
            // 🔸 fallback redirect ไปสมัคร
            if (this.userIdFromLine) {
                this._router.navigate(['/register'], {
                    queryParams: { user_id: this.userIdFromLine },
                });
                return;
            }
        }
    }



    generateMonths(): void {
        const start = DateTime.now().startOf('month');
        this.months = [];

        for (let i = 0; i < this.displayMonthCount; i++) {
            const month = start.plus({ months: i });
            this.months.push(month.toFormat('yyyy-MM'));
        }
    }

    loadEvents(): void {
        this.user = JSON.parse(localStorage.getItem('user'));
        const userId = this.user?.id;
        console.log(userId);
        
        this._service.getCalendarUser(userId).subscribe((resp: any) => {
             
            const newEvents = resp
                .map((item: any) => {
                    let color = 'bg-gray-400';
                    switch (item.status) {
                        case 'Ordered': color = 'bg-yellow-500'; break;
                        case 'Reject': color = 'bg-red-500'; break;
                        case 'Confirm': color = 'bg-green-500'; break;
                        case 'Approve': color = 'bg-green-600'; break;
                        case 'Finish': color = 'bg-blue-500'; break;
                        case 'Returned': color = 'bg-purple-500'; break;
                    }

                    return {
                        id: item.id,
                        title: item.code || 'ไม่ระบุ',
                        start: item.start_date,
                        end: item.end_date,
                        code: item.code,
                        reserve_ref_no: item.reserve_ref_no,
                        request_purpose: item.request_purpose,
                        color,
                        status: item.status || 'กำลังดำเนินการ',
                    };
                })
                .filter(event => DateTime.fromISO(event.start).year === +this.selectedYear);
            
            // 🟦 สร้าง 12 เดือนล่วงหน้า
            this.groupedTimelineEvents = {};
            for (let month = 1; month <= 12; month++) {
                const paddedMonth = month.toString().padStart(2, '0');
                const monthKey = `${this.selectedYear}-${paddedMonth}`;
                this.groupedTimelineEvents[monthKey] = [];
            }

            // 🟩 ใส่ข้อมูล event ลงในเดือนที่ตรงกัน
            for (const event of newEvents) {
                const monthKey = DateTime.fromISO(event.start).toFormat('yyyy-MM');
                if (this.groupedTimelineEvents[monthKey]) {
                    this.groupedTimelineEvents[monthKey].push(event);
                }
            }

            // 🔃 เรียงภายในเดือน
            for (const key in this.groupedTimelineEvents) {
                this.groupedTimelineEvents[key].sort((a, b) =>
                    DateTime.fromISO(a.start).toMillis() - DateTime.fromISO(b.start).toMillis()
                );
            }
       
            this._changeDetectorRef.detectChanges(); // แทน markForCheck ถ้าจำเป็น
        });
    }



    // Original desktop functions
    getSpanStyle(event: TimelineEvent): any {
        const startMonth = DateTime.fromISO(event.start).toFormat('yyyy-MM');
        const endMonth = DateTime.fromISO(event.end).toFormat('yyyy-MM');

        const startIndex = this.months.indexOf(startMonth);
        const endIndex = this.months.indexOf(endMonth);
        const span = endIndex - startIndex + 1;

        if (startIndex < 0 || endIndex < 0) return { display: 'none' };

        return {
            gridColumn: `${startIndex + 2} / span ${span}`
        };
    }

    // New mobile-specific functions
    getMonthAbbreviation(month: string): string {
        return DateTime.fromFormat(month, 'yyyy-MM').toFormat('MMM');
    }

    getShortDate(date: string): string {
        return DateTime.fromISO(date).toFormat('d MMM');
    }

    getEventDuration(event: TimelineEvent): string {
        const start = DateTime.fromISO(event.start);
        const end = DateTime.fromISO(event.end);
        return `${start.toFormat('d')}-${end.toFormat('d MMM')}`;
    }

    getMobileProgressStyle(event: TimelineEvent): any {
        const startDate = DateTime.fromISO(event.start);
        const endDate = DateTime.fromISO(event.end);
        const totalMonths = this.months.length;

        // Calculate position and width as percentages
        const firstMonth = DateTime.fromFormat(this.months[0], 'yyyy-MM').startOf('month');
        const lastMonth = DateTime.fromFormat(this.months[this.months.length - 1], 'yyyy-MM').endOf('month');

        const totalDays = lastMonth.diff(firstMonth, 'days').days;
        const startOffset = startDate.diff(firstMonth, 'days').days;
        const durationDays = endDate.diff(startDate, 'days').days;

        const startPercent = Math.max(0, (startOffset / totalDays) * 100);
        const widthPercent = Math.min(100, (durationDays / totalDays) * 100);

        return {
            'margin-left': `${startPercent}%`,
            'width': `${widthPercent}%`
        };
    }
    goBack() {
        // Implement your back navigation logic here
        this.location.back(); // Example using Location service
    }

    getMonths(): string[] {
        return Object.keys(this.groupedTimelineEvents).sort((a, b) => a.localeCompare(b));
    }

    formatMonth(month: string): string {
        // ใช้ Luxon เพื่อแสดงเดือนในรูปแบบสวยงาม เช่น "มิถุนายน 2025"
        return DateTime.fromFormat(month, 'yyyy-MM').setLocale('th').toFormat('MMMM yyyy');
    }

    // Add these properties to your component
    expandedMonths: Set<string> = new Set();
    isAllExpanded: boolean = false;

    getAllMonths(): { key: string, name: string }[] {
        const months = [];

        for (let i = 1; i <= 12; i++) {
            const monthKey = `${this.selectedYear}-${i.toString().padStart(2, '0')}`;
            months.push({
                key: monthKey,
                name: DateTime.fromFormat(monthKey, 'yyyy-MM')
                    .setLocale('th')
                    .toFormat('MMMM yyyy')
            });
        }

        return months;
    }


    getEventCount(monthKey: string): number {
        return this.groupedTimelineEvents[monthKey]?.length || 0;
    }

    isMonthExpanded(monthKey: string): boolean {
        return this.expandedMonths.has(monthKey);
    }

    toggleMonth(monthKey: string): void {
        if (this.expandedMonths.has(monthKey)) {
            this.expandedMonths.delete(monthKey);
        } else {
            this.expandedMonths.add(monthKey);
        }
    }

    toggleExpandAll(): void {
        if (this.isAllExpanded) {
            this.expandedMonths.clear();
        } else {
            this.getAllMonths().forEach(month => {
                if (this.getEventCount(month.key) > 0) {
                    this.expandedMonths.add(month.key);
                }
            });
        }
        this.isAllExpanded = !this.isAllExpanded;
    }

    // Add this property
    currentYear = DateTime.now().year;

    // Add this method to calculate total events
    getTotalEvents(): number {
        return Object.values(this.groupedTimelineEvents).reduce((total, events) => total + events.length, 0);
    }

    formatMonthNumber(key: string | undefined): string {
        if (!key) return '-';
        try {
            return DateTime.fromFormat(key, 'yyyy-MM').toFormat('M');
        } catch (e) {
            console.error('Invalid month key:', key, e);
            return '-';
        }
    }

    getStatusBadge(status: string): { label: string, colorClass: string } {
        switch (status) {
            case 'Ordered': return { label: 'รออนุมัติ', colorClass: 'bg-yellow-200 text-yellow-800' };
            case 'Reject': return { label: 'ไม่อนุมัติ', colorClass: 'bg-red-200 text-red-800' };
            case 'Confirm': return { label: 'อนุมัติ', colorClass: 'bg-green-200 text-green-800' };
            case 'Approve': return { label: 'รอรับของ', colorClass: 'bg-green-200 text-green-800' };
            case 'Finish': return { label: 'รอคืน', colorClass: 'bg-blue-200 text-blue-800' };
            case 'Returned': return { label: 'เสร็จสิ้น', colorClass: 'bg-purple-200 text-purple-800' };
            default: return { label: 'กำลังดำเนินการ', colorClass: 'bg-gray-200 text-gray-800' };
        }
    }


    viewDetail(id: any) {
        this._router.navigate(['/line/view/booking/' + id]); // นำทางไปยังหน้าที่กำหนด พร้อมพารามิเตอร์
    }

    activeTab: 'myBookings' | 'equipmentBookings' = 'myBookings';
    selectedEquipment: string = '';
    equipmentList: any[] = []; // Populate this with your equipment data
    equipmentBookings: any[] = []; // Will hold filtered bookings by equipment

    onEquipmentChange() {
        // Filter bookings based on selected equipment
        if (this.selectedEquipment) {
            this.equipmentBookings = this.getBookingsByEquipment(this.selectedEquipment);
        } else {
            this.equipmentBookings = this.getAllEquipmentBookings();
        }
    }

    // Add these methods to your component
    getBookingsByEquipment(equipmentId: string): any[] {
        // Implement your logic to filter bookings by equipment
        return [];
    }

    getAllEquipmentBookings(): any[] {
        // Implement your logic to get all equipment bookings
        return [];
    }

    formatDateRange(startDate: string, endDate: string): string {
        // Implement date formatting
        return `${startDate} - ${endDate}`;
    }
    onYearChange() {
        //  this.generateMonths();
        this.loadEvents(); // ดึงข้อมูลใหม่ตามปีที่เลือก
    }

    


    goHome() {
        this._router.navigate(['/line/list/booking']);
    }
    newForm() {
        this._router.navigate(['/line/form']);
    }

    goCalendar() {
        this._router.navigate(['/line/calendar-timeline']);
    }

    goNews() {
        this._router.navigate(['/line/news']);
    }

}