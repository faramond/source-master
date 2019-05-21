import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dash } from './dash';
import { of } from 'rxjs';
import { delay, finalize } from 'rxjs/operators';
import { log } from '../app';
import { ShareService } from '../share/share.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { scrub } from '../app';
import { Router } from '@angular/router';
import { mergeMap, tap } from 'rxjs/operators';
import { DashService } from './dash.service';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss']
})
export class DashComponent {

  name: string;
  formGroup: FormGroup;
  suggestions = [];
  offer: any
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, public shareService: ShareService,
    private dashService: DashService, private router: Router) {
    log(this).construct();
    this.formGroup = formBuilder.group({
      domainName: [null, Validators.required]
    });
    this.name = localStorage['fName'];
  }

  onLogout() {
    this.router.navigate(['login']);
  }

  onSubmit() {
    this.suggestions = [];
    of(scrub(this.formGroup)).pipe(
      tap(() => this.shareService.spinner().start()),
      mergeMap(value => this.dashService.submitDetails(value)),
      finalize(() => this.shareService.spinner().stop())
    ).subscribe(next => {
      if (next['message'] === 'domain not available') {
        this.suggestions = (next['suggestions'])
        console.log('heloo ' + this.suggestions[1]);
      } else {
        this.offer = next['offer']
        this.shareService.dialog().confirm({
          title: '',
          content: 'Domain created sucessfully and invoice has been sent to your registered email address. Cost of the domain will be ' +next['amount'] + '/year',
          confirm: { confirm: 'OK' }
        });
      }
    }, error => this.shareService.snack(error));
  }
}
