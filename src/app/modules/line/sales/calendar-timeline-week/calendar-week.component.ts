// calendar-week.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarOptions } from '@fullcalendar/core';

// ✅ ต้อง register plugin ก่อนใช้
// FullCalendarModule.registerPlugins([timeGridPlugin]);

@Component({
    selector: 'app-calendar-week',
    standalone: true,
    imports: [
        CommonModule,
        FullCalendarModule
    ],
    templateUrl: './calendar-week.component.html',
    styleUrls: ['./calendar-week.component.scss']
})
export class CalendarWeekComponent {
    calendarOptions: CalendarOptions = {
        plugins: [timeGridPlugin],
        initialView: 'timeGridWeek',
        nowIndicator: true,
        allDaySlot: false,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,timeGridDay'
        },
        slotMinTime: '06:00:00',
        slotMaxTime: '20:00:00',
        events: [
            {
                title: 'Morning Standup',
                start: this.todayWithTime('09:00'),
                end: this.todayWithTime('09:30')
            },
            {
                title: 'Project Review',
                start: this.todayWithTime('13:00'),
                end: this.todayWithTime('14:30')
            }
        ]
    };

    todayWithTime(time: string): string {
        const today = new Date().toISOString().split('T')[0];
        return `${today}T${time}:00`;
    }
}
