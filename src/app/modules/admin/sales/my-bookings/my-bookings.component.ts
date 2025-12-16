import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DateTime } from 'luxon';
import { PageService } from '../page.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';

interface TimelineEvent {
    id: number;
    title: string;
    start: string; // 'YYYY-MM-DD'
    end: string;   // 'YYYY-MM-DD'
    color?: string;
}

@Component({
    selector: 'app-my-bookings',
    templateUrl: './my-bookings.component.html',
    styleUrls: ['./my-bookings.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        MatFormFieldModule,
        FullCalendarModule,
    ]
})
export class MyBookingsComponent implements OnInit, AfterViewInit {
    user: any;
    selectedYear: number = new Date().getFullYear();
    allYears: number[] = [];
    
    // View toggle
    currentView: 'table' | 'calendar' = 'table';
    
    // Calendar properties
    @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        weekends: true,
        events: [],
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek'
        },
        eventClick: this.onCalendarEventClick.bind(this),
        height: 'auto'
    };
    
    // Store all events for both views
    allEvents: any[] = [];
    
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: PageService,
        private _router: Router
    ) {}

    ngOnInit(): void {
        const currentYear = new Date().getFullYear();
        for (let y = currentYear - 2; y <= currentYear + 2; y++) {
            this.allYears.push(y);
        }
        this.loadEvents();
    }

    loadEvents(): void {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            console.error('User not found in localStorage');
            return;
        }
        
        try {
            this.user = JSON.parse(userStr);
        } catch (e) {
            console.error('Error parsing user from localStorage:', e);
            return;
        }
        
        const userId = this.user?.id;
        console.log('Loading events for user ID:', userId);
        
        if (!userId) {
            console.error('User ID not found in localStorage');
            return;
        }
        
        this._service.getCalendarUser(userId).subscribe((resp: any) => {
            const newEvents = resp
                .map((item: any) => {
                    let color = 'bg-gray-400';
                    let calendarColor = '#9CA3AF'; // Default gray
                    switch (item.status) {
                        case 'Ordered': 
                            color = 'bg-yellow-500'; 
                            calendarColor = '#EAB308'; 
                            break;
                        case 'Reject': 
                            color = 'bg-red-500'; 
                            calendarColor = '#EF4444'; 
                            break;
                        case 'Confirm': 
                            color = 'bg-green-500'; 
                            calendarColor = '#22C55E'; 
                            break;
                        case 'Approve': 
                            color = 'bg-green-600'; 
                            calendarColor = '#16A34A'; 
                            break;
                        case 'Finish': 
                            color = 'bg-blue-500'; 
                            calendarColor = '#3B82F6'; 
                            break;
                        case 'Returned': 
                            color = 'bg-purple-500'; 
                            calendarColor = '#A855F7'; 
                            break;
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
                        calendarColor,
                        status: item.status || 'กำลังดำเนินการ',
                        client_id: item.client_id,
                        province: item.province,
                        department: item.department,
                        budget: item.budget,
                    };
                })
                .filter(event => DateTime.fromISO(event.start).year === +this.selectedYear);
            
            // Store all events
            this.allEvents = newEvents;
            
            // Update calendar events
            this.updateCalendarEvents();
       
            this._changeDetectorRef.detectChanges();
        }, (error) => {
            console.error('Error loading events:', error);
        });
    }
    
    updateCalendarEvents(): void {
        const calendarEvents = this.allEvents.map(event => ({
            id: event.id.toString(),
            title: event.code || 'ไม่ระบุ',
            start: event.start,
            end: DateTime.fromISO(event.end).plus({ days: 1 }).toISODate(),
            backgroundColor: event.calendarColor,
            borderColor: event.calendarColor,
            extendedProps: {
                reserve_ref_no: event.reserve_ref_no,
                request_purpose: event.request_purpose,
                status: event.status,
            }
        }));
        
        this.calendarOptions = {
            ...this.calendarOptions,
            events: calendarEvents
        };
    }
    
    onCalendarEventClick(info: any): void {
        const eventId = parseInt(info.event.id);
        this.viewDetail(eventId);
    }
    
    toggleView(view: 'table' | 'calendar'): void {
        this.currentView = view;
        if (view === 'calendar' && this.calendarComponent) {
            setTimeout(() => {
                this.calendarComponent.getApi().updateSize();
            }, 100);
        }
    }
    
    ngAfterViewInit(): void {
        if (this.currentView === 'calendar' && this.calendarComponent) {
            setTimeout(() => {
                this.calendarComponent.getApi().updateSize();
            }, 100);
        }
    }
    
    getAllEventsForTable(): any[] {
        return this.allEvents.sort((a, b) => 
            DateTime.fromISO(a.start).toMillis() - DateTime.fromISO(b.start).toMillis()
        );
    }
    
    formatDate(date: string): string {
        return DateTime.fromISO(date).setLocale('th').toFormat('dd MMM yyyy');
    }
    
    formatDateRange(startDate: string, endDate: string): string {
        const start = DateTime.fromISO(startDate).setLocale('th').toFormat('dd MMM yyyy');
        const end = DateTime.fromISO(endDate).setLocale('th').toFormat('dd MMM yyyy');
        return `${start} - ${end}`;
    }

    getTotalEvents(): number {
        return this.allEvents.length;
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
        this._router.navigate(['/admin/sales/view/' + id]);
    }

    onYearChange() {
        this.loadEvents();
    }
}
