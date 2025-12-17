import { CommonModule, CurrencyPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { ProjectService } from 'app/modules/admin/dashboards/project/project.service';
import { DateTime } from 'luxon';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';

interface CalendarDay {
    date: DateTime;
    isCurrentMonth: boolean;
    isToday: boolean;
    hasBooking: boolean;
}
interface BookingItem {
    status: string;
    // หรือใส่ partial แบบนี้ถ้าไม่อยากประกาศทั้งหมด
    [key: string]: any;
}

interface StatusSummary {
    Ordered: number;
    Approve: number;
    Reject: number;
    Confirm: number;
    Finish: number;
    Returned: number;
    Total: number;
}

interface DepartmentItem {
    id: number;
    name: string;
    products: any[];
}

interface ProductCount {
    name: string;
    count: number;
}

@Component({
    selector: 'project',
    templateUrl: './project.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [TranslocoModule,
        MatIconModule, MatButtonModule,
        MatRippleModule, MatMenuModule,
        MatTabsModule, MatButtonToggleModule,
        NgApexchartsModule, NgFor, NgIf,
        MatTableModule, NgClass, CurrencyPipe, DataTablesModule, CommonModule
    ],
})
export class ProjectComponent implements OnInit, OnDestroy {

    @ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;
    isLoading: boolean = false;
    dtOptions: DataTables.Settings = {};
    bookingData: BookingItem[] = [];
    summary!: StatusSummary;
    showPopup = false;
    popupData: any;
    chartGithubIssues: ApexOptions = {};
    chartTaskDistribution: ApexOptions = {};
    chartBudgetDistribution: ApexOptions = {};
    chartWeeklyExpenses: ApexOptions = {};
    chartMonthlyExpenses: ApexOptions = {};
    chartYearlyExpenses: ApexOptions = {};
    data: any;
    dataRow: any;
    user: any;
    selectedProject: string = 'ACME Corp. Backend App';
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    departments: DepartmentItem[] = [];
    productCounts: ProductCount[] = [];

    currentMonth: DateTime = DateTime.now();
    calendarDays: CalendarDay[] = [];
    bookings: string[] = []; // ['2025-06-01', '2025-06-14'] กำหนดวันที่มีการจอง

    /**
     * Constructor
     */
    constructor(
        private _projectService: ProjectService,
        private _router: Router,
        private _changeDetectorRef: ChangeDetectorRef
    ) {

        this.user = JSON.parse(localStorage.getItem('user'));
        console.log(this.user);

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.generateCalendar()
        
        // ดึง user_id จาก localStorage เพื่อกรองข้อมูลเฉพาะของตนเอง
        const userId = this.user?.id;
        
        this._projectService.getOrderStatus(userId).subscribe((resp: any) => {
            this.bookingData = resp.data; // จากที่คุณส่งมา: res.data คือ array
            this.summary = this.countStatus(this.bookingData);
            
            // อัปเดต bookings array จากข้อมูลการจองที่ได้
            this.updateBookingsFromData();
            this.generateCalendar(); // สร้างปฏิทินใหม่พร้อมข้อมูลการจอง
            this._changeDetectorRef.markForCheck();
        })

        this._projectService.getProductCategory(userId).subscribe((resp: any) => {
            this.departments = resp.data;
            this.productCounts = this.countProductsByType(this.departments);
            console.log(this.productCounts, 'productCounts');
            this._changeDetectorRef.markForCheck();
        })
        // เช็คว่าถ้ากดปิดไปแล้ววันนี้จะไม่แสดงอีก
        if (!this._projectService.hasClosedToday()) {
            this.loadTable();
        }
        // Get the data
        this._projectService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                // Store the data
                this.data = data;

                // Prepare the chart data
                this._prepareChartData();
            });

        // Attach SVG fill fixer to all ApexCharts
        window['Apex'] = {
            chart: {
                events: {
                    mounted: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    },
                    updated: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    },
                },
            },
        };
    }

    generateCalendar(): void {
        const firstDayOfMonth = this.currentMonth.startOf('month');
        const startOfCalendar = firstDayOfMonth.startOf('week'); // วันอาทิตย์
        const endOfCalendar = this.currentMonth.endOf('month').endOf('week');

        const days: CalendarDay[] = [];
        let currentDay = startOfCalendar;

        while (currentDay <= endOfCalendar) {
            days.push({
                date: currentDay,
                isCurrentMonth: currentDay.month === this.currentMonth.month,
                isToday: currentDay.hasSame(DateTime.now(), 'day'),
                hasBooking: this.bookings.includes(currentDay.toISODate() ?? ''),
            });
            currentDay = currentDay.plus({ days: 1 });
        }

        this.calendarDays = days;
    }

    updateBookingsFromData(): void {
        // รีเซ็ต bookings array
        this.bookings = [];
        
        // ดึงวันที่ที่มีการจองจาก bookingData
        if (this.bookingData && Array.isArray(this.bookingData)) {
            this.bookingData.forEach((booking: any) => {
                // ตรวจสอบว่ามี date_start หรือ date_end หรือไม่
                if (booking.date_start) {
                    const date = DateTime.fromISO(booking.date_start);
                    if (date.isValid) {
                        const dateStr = date.toISODate();
                        if (dateStr && !this.bookings.includes(dateStr)) {
                            this.bookings.push(dateStr);
                        }
                    }
                }
                if (booking.date_end) {
                    const date = DateTime.fromISO(booking.date_end);
                    if (date.isValid) {
                        const dateStr = date.toISODate();
                        if (dateStr && !this.bookings.includes(dateStr)) {
                            this.bookings.push(dateStr);
                        }
                    }
                }
            });
        }
    }

    goToPreviousMonth(): void {
        this.currentMonth = this.currentMonth.minus({ months: 1 });
        this.generateCalendar();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Fix the SVG fill references. This fix must be applied to all ApexCharts
     * charts in order to fix 'black color on gradient fills on certain browsers'
     * issue caused by the '<base>' tag.
     *
     * Fix based on https://gist.github.com/Kamshak/c84cdc175209d1a30f711abd6a81d472
     *
     * @param element
     * @private
     */
    private _fixSvgFill(element: Element): void {
        // Current URL
        const currentURL = this._router.url;

        // 1. Find all elements with 'fill' attribute within the element
        // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
        // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
        Array.from(element.querySelectorAll('*[fill]'))
            .filter(el => el.getAttribute('fill').indexOf('url(') !== -1)
            .forEach((el) => {
                const attrVal = el.getAttribute('fill');
                el.setAttribute('fill', `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`);
            });
    }

    /**
     * Prepare the chart data from the data
     *
     * @private
     */
    private _prepareChartData(): void {
        // Github issues
        this.chartGithubIssues = {
            chart: {
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'line',
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
            },
            colors: ['#64748B', '#94A3B8'],
            dataLabels: {
                enabled: true,
                enabledOnSeries: [0],
                background: {
                    borderWidth: 0,
                },
            },
            grid: {
                borderColor: 'var(--fuse-border)',
            },
            labels: this.data.githubIssues.labels,
            legend: {
                show: false,
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%',
                },
            },
            series: this.data.githubIssues.series,
            states: {
                hover: {
                    filter: {
                        type: 'darken',
                        value: 0.75,
                    },
                },
            },
            stroke: {
                width: [3, 0],
            },
            tooltip: {
                followCursor: true,
                theme: 'dark',
            },
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    color: 'var(--fuse-border)',
                },
                labels: {
                    style: {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
                tooltip: {
                    enabled: false,
                },
            },
            yaxis: {
                labels: {
                    offsetX: -16,
                    style: {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
            },
        };

        // Task distribution
        this.chartTaskDistribution = {
            chart: {
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'polarArea',
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
            },
            labels: this.data.taskDistribution.labels,
            legend: {
                position: 'bottom',
            },
            plotOptions: {
                polarArea: {
                    spokes: {
                        connectorColors: 'var(--fuse-border)',
                    },
                    rings: {
                        strokeColor: 'var(--fuse-border)',
                    },
                },
            },
            series: this.data.taskDistribution.series,
            states: {
                hover: {
                    filter: {
                        type: 'darken',
                        value: 0.75,
                    },
                },
            },
            stroke: {
                width: 2,
            },
            theme: {
                monochrome: {
                    enabled: true,
                    color: '#93C5FD',
                    shadeIntensity: 0.75,
                    shadeTo: 'dark',
                },
            },
            tooltip: {
                followCursor: true,
                theme: 'dark',
            },
            yaxis: {
                labels: {
                    style: {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
            },
        };

        // Budget distribution
        this.chartBudgetDistribution = {
            chart: {
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'radar',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#818CF8'],
            dataLabels: {
                enabled: true,
                formatter: (val: number): string | number => `${val}%`,
                textAnchor: 'start',
                style: {
                    fontSize: '13px',
                    fontWeight: 500,
                },
                background: {
                    borderWidth: 0,
                    padding: 4,
                },
                offsetY: -15,
            },
            markers: {
                strokeColors: '#818CF8',
                strokeWidth: 4,
            },
            plotOptions: {
                radar: {
                    polygons: {
                        strokeColors: 'var(--fuse-border)',
                        connectorColors: 'var(--fuse-border)',
                    },
                },
            },
            series: this.data.budgetDistribution.series,
            stroke: {
                width: 2,
            },
            tooltip: {
                theme: 'dark',
                y: {
                    formatter: (val: number): string => `${val}%`,
                },
            },
            xaxis: {
                labels: {
                    show: true,
                    style: {
                        fontSize: '12px',
                        fontWeight: '500',
                    },
                },
                categories: this.data.budgetDistribution.categories,
            },
            yaxis: {
                max: (max: number): number => parseInt((max + 10).toFixed(0), 10),
                tickAmount: 7,
            },
        };

        // Weekly expenses
        this.chartWeeklyExpenses = {
            chart: {
                animations: {
                    enabled: false,
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'line',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#22D3EE'],
            series: this.data.weeklyExpenses.series,
            stroke: {
                curve: 'smooth',
            },
            tooltip: {
                theme: 'dark',
            },
            xaxis: {
                type: 'category',
                categories: this.data.weeklyExpenses.labels,
            },
            yaxis: {
                labels: {
                    formatter: (val): string => `$${val}`,
                },
            },
        };

        // Monthly expenses
        this.chartMonthlyExpenses = {
            chart: {
                animations: {
                    enabled: false,
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'line',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#4ADE80'],
            series: this.data.monthlyExpenses.series,
            stroke: {
                curve: 'smooth',
            },
            tooltip: {
                theme: 'dark',
            },
            xaxis: {
                type: 'category',
                categories: this.data.monthlyExpenses.labels,
            },
            yaxis: {
                labels: {
                    formatter: (val): string => `$${val}`,
                },
            },
        };

        // Yearly expenses
        this.chartYearlyExpenses = {
            chart: {
                animations: {
                    enabled: false,
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'line',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#FB7185'],
            series: this.data.yearlyExpenses.series,
            stroke: {
                curve: 'smooth',
            },
            tooltip: {
                theme: 'dark',
            },
            xaxis: {
                type: 'category',
                categories: this.data.yearlyExpenses.labels,
            },
            yaxis: {
                labels: {
                    formatter: (val): string => `$${val}`,
                },
            },
        };
    }

    closePopup(): void {
        this.showPopup = false;
        this._projectService.setClosedToday();
    }

    pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0, total: 0 };
    gotoPage: number = 1; // ตัวแปรสำหรับการไปหน้าที่กำหนด
    loadTable(): void {
        const user = JSON.parse(localStorage.getItem('user'));
        const dataTablesParameters = {
            draw: 1, // ระบุ draw เริ่มต้น
            status: 'Finish',
            start: 0, // จุดเริ่มต้นของข้อมูล
            length: 10, // จำนวนข้อมูลต่อหน้า
            columns: [
                { data: 'No', name: '', searchable: true, orderable: true, search: { value: '', regex: false } },
                { data: 'user.fullname', name: '', searchable: true, orderable: true, search: { value: '', regex: false } },
                { data: 'description', name: '', searchable: true, orderable: true, search: { value: '', regex: false } },
                { data: 'leave_type.name', name: '', searchable: true, orderable: true, search: { value: '', regex: false } },
                { data: 'date', name: '', searchable: true, orderable: true, search: { value: '', regex: false } },
                { data: 'date_start', name: '', searchable: true, orderable: true, search: { value: '', regex: false } },
                { data: 'date_end', name: '', searchable: true, orderable: true, search: { value: '', regex: false } }
            ],
            order: [
                { column: 0, dir: 'desc' } // จัดเรียงตามคอลัมน์แรก
            ],
            search: { value: '', regex: false }, // ค่า search

        };

        // ส่ง API และเก็บผลลัพธ์
        this._projectService.getOrderForWarehouse(dataTablesParameters).subscribe(
            (resp) => {
                if (resp.data.data.length > 0) {
                    this.popupData = resp;
                    this.showPopup = true;
                }
                this.dataRow = resp.data.data; // เก็บข้อมูลที่ได้
                this.pages.current_page = this.dataRow.current_page;
                this.pages.last_page = this.dataRow.last_page;
                this.pages.per_page = this.dataRow.per_page;
                this.pages.total = this.dataRow.total;
                if (this.dataRow.current_page > 1) {
                    this.pages.begin =
                        this.dataRow.per_page * this.dataRow.current_page - 1;
                } else {
                    this.pages.begin = 0;
                }
                this._changeDetectorRef.markForCheck()
            },
            (error) => {
                console.error('API Error:', error);
            }
        );
    }


    goToNextMonth(): void {
        this.currentMonth = this.currentMonth.plus({ months: 1 });
        this.generateCalendar();
    }

    getMonthLabel(): string {
        return this.currentMonth.toFormat('LLLL yyyy'); // เช่น "มิถุนายน 2025"
    }

    countStatus(data: BookingItem[]): StatusSummary {
        const summary: StatusSummary = {
            Ordered: 0,
            Approve: 0,
            Reject: 0,
            Confirm: 0,
            Finish: 0,
            Returned: 0,
            Total: 0
        };

        for (const item of data) {
            const status = item.status;
            if (status in summary) {
                summary[status as keyof StatusSummary]++;
            }
            summary.Total++;
        }

        return summary;
    }

    countProductsByType(data: DepartmentItem[]): ProductCount[] {
        return data.map(item => ({
            name: item.name,
            count: item.products?.length || 0
        }));
    }

    getIconBgColor(name: string): string {
        switch (name) {
            case 'Echocardiogram':
                return 'bg-blue-100';
            case 'Ultrasound Imaging':
                return 'bg-green-100';
            case 'RC':
                return 'bg-yellow-100';
            case 'EC':
                return 'bg-purple-100';
            default:
                return 'bg-gray-100';
        }
    }

    getIconColor(name: string): string {
        switch (name) {
            case 'Echocardiogram':
                return 'text-blue-600';
            case 'Ultrasound Imaging':
                return 'text-green-600';
            case 'RC':
                return 'text-yellow-600';
            case 'EC':
                return 'text-purple-600';
            default:
                return 'text-gray-600';
        }
    }

    getTextColor(name: string): string {
        switch (name) {
            case 'Echocardiogram':
                return 'text-blue-600';
            case 'Ultrasound Imaging':
                return 'text-green-600';
            case 'RC':
                return 'text-yellow-600';
            case 'EC':
                return 'text-purple-600';
            default:
                return 'text-gray-600';
        }
    }

}
