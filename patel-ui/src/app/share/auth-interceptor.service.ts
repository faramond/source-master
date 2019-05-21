import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

import {Observable} from 'rxjs';
import {log} from '../app';
import {ShareService} from './share.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private shareService: ShareService) {
    log(this).construct();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.shareService.username ? req.clone({headers: req.headers.set('User', this.shareService.username)}) : req);
  }
}
