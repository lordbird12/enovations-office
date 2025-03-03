import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(): Observable<any> {
        return this._httpClient.get('api/dashboards/project').pipe(
            tap((response: any) => {
                this._data.next(response);
            }),
        );
    }

    // ตรวจสอบว่าวันนี้เคยกดปิด popup ไปหรือยัง
    hasClosedToday(): boolean {
        const lastClosedDate = localStorage.getItem('popup_closed_date');
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        return lastClosedDate === today;
    }

    // บันทึกว่าวันนี้กดปิดไปแล้ว
    setClosedToday(): void {
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem('popup_closed_date', today);
    }

    getOrderForWarehouse(dataTablesParameters: any): Observable<any> {
        return this._httpClient.post(
            environment.baseURL + '/api/orders_page',
            dataTablesParameters,
        );
    }
    
}
