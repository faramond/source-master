import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Cart } from './search';
import { delay } from 'rxjs/operators';
import { log, transform } from '../app';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class SearchService {

  constructor(private http: HttpClient) {
    log(this).construct();
  }

 read(value): Observable<Cart[]> {
    const context = log(this).in('read');

      return this.http.get<Cart[]>('/patel/api/domain/' + value.search)
      .pipe(transform(context));
  }

  payment(value): Observable<Cart[]> {
    const context = log(this).in('read');
    console.log('Lol' + value)
      return this.http.post<Cart[]>('/patel/api/payment', value)
      .pipe(transform(context));
  }

  createDomain(value): Observable<Cart[]> {
    const context = log(this).in('read');
    console.log('Lol' + value)
      return this.http.post<Cart[]>('/patel/api/domain', value)
      .pipe(transform(context));
  }
}
