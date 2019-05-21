import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Dash } from './dash';
import { delay } from 'rxjs/operators';
import { log, transform } from '../app';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class DashService {

  constructor(private http: HttpClient) {
    log(this).construct();
  }

  submitDetails(data): Observable<any> {
    //  data.outcome = data.outcome[0];
    const context = log(this).in('login');
    return this.http.post<any>(`/patel/api/domain/ragister`, data).pipe(
      transform(context, {
        status: 400,
        message: 'Failed',
        contains: 'login failed'
      })
    );
  }

}
