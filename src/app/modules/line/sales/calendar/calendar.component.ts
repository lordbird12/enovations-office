import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Router, ActivatedRoute } from '@angular/router';
import { PageService } from '../page.service';
import { DateTime } from 'luxon';
import { event } from 'jquery';

interface CalendarDay {
    date: Date;
    isToday: boolean;
    isCurrentMonth: boolean;
    hasEvent: boolean;
    isSelected?: boolean;
}

interface CalendarEvent {
    date: string; // YYYY-MM-DD format
    title: string;
    color?: string; // Optional for event type coloring
}

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatFormFieldModule,
    ]
})
export class CalendarComponent implements OnInit {
    today = new Date();
    currentYear: number;
    currentMonth: number;
    days: (CalendarDay | null)[] = [];
    selectedDate: Date | null = null;
    user: any;
    // Month names for display
    monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    events: CalendarEvent[] = [
        { date: '2025-06-29', title: 'ประชุมทีม', color: 'blue' },
        { date: '2025-07-01', title: 'สินค้าเข้า', color: 'green' },
    ];

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: PageService,
        private _router: Router,
        private _activated: ActivatedRoute
    ) {
        this.user = JSON.parse(localStorage.getItem('user'))
        this.currentYear = this.today.getFullYear();
        this.currentMonth = this.today.getMonth();
    }

    ngOnInit(): void {
        // this.generateCalendar();
        this.getCalendar();
    }

    generateCalendar(): void {
        const start = new Date(this.currentYear, this.currentMonth, 1);
        const end = new Date(this.currentYear, this.currentMonth + 1, 0);
        const startDay = start.getDay(); // 0 = Sunday
        const daysInMonth = end.getDate();

        const calendarDays: (CalendarDay | null)[] = [];

        // Days from previous month
        const prevMonthEnd = new Date(this.currentYear, this.currentMonth, 0).getDate();
        for (let i = startDay - 1; i >= 0; i--) {
            const date = new Date(this.currentYear, this.currentMonth - 1, prevMonthEnd - i);
            calendarDays.push({
                date,
                isToday: this.isToday(date),
                isCurrentMonth: false,
                hasEvent: this.hasEvent(date)
            });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(this.currentYear, this.currentMonth, i);
            calendarDays.push({
                date,
                isToday: this.isToday(date),
                isCurrentMonth: true,
                hasEvent: this.hasEvent(date),
                isSelected: this.selectedDate ? this.isSameDay(date, this.selectedDate) : false
            });
        }

        // Days from next month to complete the grid
        const totalCells = Math.ceil(calendarDays.length / 7) * 7;
        const nextMonthDays = totalCells - calendarDays.length;
        for (let i = 1; i <= nextMonthDays; i++) {
            const date = new Date(this.currentYear, this.currentMonth + 1, i);
            calendarDays.push({
                date,
                isToday: this.isToday(date),
                isCurrentMonth: false,
                hasEvent: this.hasEvent(date)
            });
        }

        this.days = calendarDays;
    }

    isToday(date: Date): boolean {
        return this.isSameDay(date, this.today);
    }

    isSameDay(date1: Date, date2: Date): boolean {
        return (
            date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
        );
    }

    hasEvent(date: Date): boolean {
        const formatted = this.formatDate(date);
        return this.events.some(e => e.date === formatted);
    }

    selectDate(day: CalendarDay): void {
        this.selectedDate = day.date;
        this.generateCalendar(); // Regenerate to update selection state
        // You could emit an event here if parent component needs to know
        // this.dateSelected.emit(day.date);
    }

    prevMonth(): void {
        if (this.currentMonth === 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else {
            this.currentMonth--;
        }
        this.generateCalendar();
    }

    nextMonth(): void {
        if (this.currentMonth === 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else {
            this.currentMonth++;
        }
        this.generateCalendar();
    }

    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    getCalendar(): void {
        const userId = this.user?.id; // สมมุติว่ามี this.user อยู่ใน component
        this._service.getCalendarUser(userId).subscribe((resp: any) => {
            const events: CalendarEvent[] = resp.map((item: any) => {
                const startDate = DateTime.fromISO(item.start_date).toISODate();
                const endDate = DateTime.fromISO(item.end_date).plus({ days: 1 }).toISODate();

                const datesInRange = this.getDateRange(startDate, endDate);
                return datesInRange.map(date => ({
                    date,
                    title: item.code,
                    color: 'red' // หรือให้เปลี่ยนตามประเภท
                }));
            }).flat();

            this.events = events;
            console.log(this.events);
            
            this.generateCalendar();
            this._changeDetectorRef.markForCheck();
        });
    }

    // ช่วยคืน array ของวันที่ในช่วง start-end
    private getDateRange(start: string, end: string): string[] {
        const startDate = DateTime.fromISO(start);
        const endDate = DateTime.fromISO(end);
        const dates: string[] = [];

        for (let dt = startDate; dt <= endDate; dt = dt.plus({ days: 1 })) {
            dates.push(dt.toISODate());
        }

        return dates;
    }
}