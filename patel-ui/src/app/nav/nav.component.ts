import { Component, OnDestroy } from '@angular/core';
import { log } from '../app';
import { Router } from '@angular/router';
import { ShareService } from '../share/share.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnDestroy {
  handset: boolean;
  private handsetSubscription: Subscription;
  showLicenseList = false;
  showCardList = false;

  constructor(public shareService: ShareService, private router: Router) {
    log(this).construct();
    this.handsetSubscription = shareService.handsetObserver.subscribe(handset => this.handset = handset);
  }

  navigate(route: string) {
    this.router.navigate([route]);
    return true;
  }

  navigatee(id) {
    alert(id);
  }

  logout() {
    log(this).info('called');
    delete this.shareService.username;
    delete this.shareService.redirect;
    this.router.navigate(['login']);
  }

  ngOnDestroy(): void {
    this.handsetSubscription.unsubscribe();
  }

  expandList() {
    this.showLicenseList = !this.showLicenseList;
    this.showCardList = false;
  }
  expandCardList() {
    this.showCardList = !this.showCardList;
    this.showLicenseList = false;
  }
}
