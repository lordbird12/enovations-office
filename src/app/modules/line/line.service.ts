import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LineService {
  private _data: BehaviorSubject<any | null> = new BehaviorSubject(null);
  constructor(
    private readonly _httpClient: HttpClient,
  ) { }

  createOt(itemtype: any): Observable<any> {
    return this._httpClient.post(environment.baseURL + 'api/ot_line', itemtype,);
  }

  getTypeOt() {
    return this._httpClient.get<any[]>(environment.baseURL + 'api/get_ot_type');
  }

  createLeave(data: FormData): Observable<any> {
    return this._httpClient.post<any>(environment.baseURL + 'api/leave_line', data);
  }

  getTypeLeavenew(lineId: string): Observable<any[]> {
    return this._httpClient.get<any[]>(environment.baseURL + 'api/get_user_leave_permission_line', {
      params: { line_id: lineId },
    });
  }

  uploadFile(item: FormData): Observable<any> {
    return this._httpClient.post<any>(environment.baseURL + 'api/upload_file', item,);
  }


  getNews(): Observable<any> {
    return this._httpClient
      .get<any>(environment.baseURL + '/api/get_news')
      .pipe(
        tap((result) => {
          this._data.next(result);
        })
      );
  }

  getNewsById(id: any): Observable<any> {
    return this._httpClient
      .get<any>(environment.baseURL + '/api/news/' + id)
      .pipe(
        tap((result) => {
          this._data.next(result);
        })
      );
  }

  getCategoryNews(): Observable<any> {
    return this._httpClient
      .get<any>(environment.baseURL + '/api/get_category_news')
      .pipe(
        tap((result) => {
          this._data.next(result);
        })
      );
  }



  // apiKey = environment.LONG_DO_API_KEY;
  count = 0;

  // reverseGeocode(lat: number, lon: number): Observable<string> {
  //   const url = `https://api.longdo.com/map/services/address?lon=${lon}&lat=${lat}&noelevation=1&key=${this.apiKey}`;

  //   return this._httpClient.get<any>(url).pipe(
  //     catchError((error) => {
  //       console.error(this.count + 'Error caught:', error);
  //       this.count += 1;
  //       if (this.count < 20) {
  //         return this.reverseGeocode(lat, lon)
  //       } return "can't found place"
  //     }),
  //     map(data => {
  //       // return `${data.data[0].name}`.trim();
  //       if (data?.aoi) return data.aoi;
  //       const road = data?.road || '';
  //       const subdistrict = data?.subdistrict || '';
  //       const district = data?.district || '';
  //       const province = data?.province || '';
  //       const country = data?.country || '';
  //       const postcode = data?.postcode || '';
  //       return `${road} ${subdistrict} ${district} ${province} ${country} ${postcode}`.trim();
  //     }),
  //   );
  // }

  canCheckIn(lat: any, lon: any): Observable<any> {
    return this._httpClient.get(
      `${environment.baseURL}api/can_check_in?latitude=${lat}&longitude=${lon}`)
  }

  checkIn(data: any): Observable<any> {
    return this._httpClient.post(
      `${environment.baseURL}api/put_zk_time`, data)
  }

  lineLogin(user_id: any): Observable<any> {
    return this._httpClient.post(environment.baseURL + '/api/login_line', {user_id: user_id});
  }

   lineRegister(data: any): Observable<any> {
    return this._httpClient.post(environment.baseURL + '/api/register_line', data);
  }



}
