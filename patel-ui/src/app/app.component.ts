import {Component} from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {log} from './app';
import {ShareService} from './share/share.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(router: Router, shareService: ShareService) {
    log(this).construct();
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        shareService.spinner().start();
      }
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        shareService.spinner().stop();
      }
      if (event instanceof NavigationCancel) {
        log(this).info(event);
        shareService.redirect = event.url;
      }
    });
  }
}
