import {
    HttpClient,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpHeaders,
    HttpInterceptor,
    HttpParams,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
    BehaviorSubject,
    filter,
    map,
    Observable,
    of,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';
import { environment } from 'environments/environment.development';
import { Form } from '@angular/forms';
import { DataTablesResponse } from 'app/shared/datatable.types';
const token = localStorage.getItem('accessToken') || null;

@Injectable({ providedIn: 'root' })
export class PageService {
    // Private
    private _data: BehaviorSubject<any | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) { }

    httpOptionsFormdata = {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    };

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    create(data: FormData): Observable<any> {
        const token = localStorage.getItem('token');
        // สร้าง header ใหม่พร้อม token
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this._httpClient
            .post<any>(environment.baseURL + '/api/orders', data, { headers })
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    createWinLost(data: FormData): Observable<any> {
        const token = localStorage.getItem('token');
        // สร้าง header ใหม่พร้อม token
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this._httpClient
            .post<any>(environment.baseURL + '/api/win_lost', data, { headers })
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    getById(id: any): Observable<any> {
        const token = localStorage.getItem('token');

        // สร้าง header ใหม่พร้อม token
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });

        return this._httpClient
            .get<any>(environment.baseURL + '/api/orders/' + id, { headers })
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    updateMachineModelProduct(data: FormData): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this._httpClient
            .post<any>(environment.baseURL + '/api/head_update_orders', data, { headers })
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    updateReturnProduct(data: FormData): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this._httpClient
            .post<any>(environment.baseURL + '/api/return', data, { headers })
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    updateStatusReturn(data: any): Observable<any> {
            const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this._httpClient
            .post<any>(environment.baseURL + '/api/update_status_return', data, { headers })
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    payment_period(data: FormData): Observable<any> {
            const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this._httpClient
            .post<any>(environment.baseURL + '/api/payment_period', data, { headers })
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    claim(data: FormData): Observable<any> {
            const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this._httpClient
            .post<any>(environment.baseURL + '/api/cleam', data, { headers })
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    udpateStatus(data: any): Observable<any> {
            const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this._httpClient
            .post<any>(environment.baseURL + '/api/update_status_order', data, { headers })
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    update(data: any, id: any): Observable<any> {
            const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this._httpClient
            .put<any>(environment.baseURL + '/api/orders/' + id, data, { headers })
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    delete(id: any): Observable<any> {
            const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this._httpClient.delete<any>(
            environment.baseURL + '/api/orders/' + id, { headers }
        );
    }

    getOrder(): Observable<any> {
            const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_orders', { headers })
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    getOrdersByUserId(userId: number): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        let params = new HttpParams();
        if (userId) {
            params = params.set('user_id', userId.toString());
        }
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_order_by_user_id/'+ userId)
            .pipe(
                switchMap((response: any) => {
                    // Return the data array from the response
                    if (response && response.data) {
                        return of(response.data);
                    }
                    return of([]);
                })
            );
    }
    getPermission(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_permission')
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    getWinLose(): Observable<any> {
            const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_win_lost', { headers })
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    /**
     * Get products
     *
     *
     * @param page
     * @param perPage
     * @param sortBy
     * @param order
     * @param search
     */

    getPage(dataTablesParameters: any): Observable<DataTablesResponse> {
        // ดึง token จาก localStorage
        const token = localStorage.getItem('token');

        // สร้าง header ใหม่พร้อม token
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });

        return this._httpClient
            .post(
                `${environment.baseURL}/api/orders_page`,
                dataTablesParameters,
                { headers } // ใช้ headers แบบ custom
            )
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }

    getCalendarUser(id: any): Observable<any> {
        // ดึง token จาก localStorage
        const token = localStorage.getItem('token');
        // สร้าง header ใหม่พร้อม token
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });

        return this._httpClient
            .get(
                `${environment.baseURL}/api/get_order_by_sale_calendar/${id}`,
                { headers } // ใช้ headers แบบ custom
            )
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }

    getClient(): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_client', { headers })
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    getFinanace(): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_finance', { headers })
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    getProduct($brand_model_id): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_product/' + $brand_model_id, { headers })
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    getBrand(): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_brand', { headers })
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    getCar(): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_product_all', { headers })
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    getBrandModel($brand_id): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_brand_model/' + $brand_id, { headers })
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    getClaim(id: any): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_cleam/' + id, { headers })
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    getUserByDepartment(id: any): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_user_by_department/' + id, { headers })
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    getPromotion(): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_promotion', { headers })
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    getGarage(): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_garage', { headers })
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    getPageCustomer(dataTablesParameters: any): Observable<DataTablesResponse> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this._httpClient
            .post(
                environment.baseURL + '/api/client_page',
                dataTablesParameters,
                { headers }
            )
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }

    getPateProduct(dataTablesParameters: any): Observable<DataTablesResponse> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this._httpClient
            .post(
                environment.baseURL + '/api/product_page',
                dataTablesParameters,
                { headers }
            )
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }
    customerCreate(data: FormData): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this._httpClient
            .post<any>(environment.baseURL + '/api/client', data, { headers })
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    getProductEno(): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_product_all', { headers })
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    getMachineModelAll(): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_machine_model_all', { headers })
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    getUser(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_user')
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    uploadImg(img: FormData): Observable<any> {
        return this._httpClient
            .post(
                environment.baseURL + '/api/upload_images',
                img,
                this.httpOptionsFormdata
            )
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }


    getAllProduct(): Observable<any> {
        return this._httpClient
            .get(
                environment.baseURL + '/api/get_product_all',

            )
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }
    getOrderByUserCalendar(id: any): Observable<any> {
        return this._httpClient
            .get(
                environment.baseURL + '/api/get_order_by_user_calendar/' + id,
            )
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }
    getOrderByProductCalendar(id: any): Observable<any> {
        return this._httpClient
            .get(
                environment.baseURL + '/api/get_order_by_product_calendar/' + id,
            )
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }
}
