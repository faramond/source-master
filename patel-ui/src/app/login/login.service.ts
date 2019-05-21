import {Injectable} from '@angular/core';
import {Login} from './login';
import {Observable, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {log, transform} from '../app';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) {
    log(this).construct();
  }

  login(login: Login): Observable<Login> {
    const context = log(this).in('login', {username: login.username});
    if (login.username == null) {
      throwError('username invalid');
    }
    if (login.password == null) {
      throwError('password invalid');
    }
    return this.http.post<Login>('/blueprint/api/security', login).pipe(
      transform(context, {
        status: 400,
        message: 'Failed',
        contains: 'login failed'
      })
    );
  }

}
