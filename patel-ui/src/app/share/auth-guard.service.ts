import {Injectable} from '@angular/core';
import {CanLoad, Route, Router} from '@angular/router';
import {ShareService} from './share.service';
import {log} from '../app';

@Injectable()
export class AuthGuardService implements CanLoad {
  constructor(private shareService: ShareService, private router: Router) {
    log(this).construct();
  }

  canLoad(route: Route): boolean {
    if (this.shareService.username != null) {
      log(this).info(`canLoad '${route.path}' true`);
      return true;
    }
    this.shareService.redirect = route.path;
    this.router.navigate(['login']);
    log(this).info(`canLoad '${route.path}' false`);
    return false;
  }
}
