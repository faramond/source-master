import { Component, HostBinding, OnDestroy } from '@angular/core';
import { LoginService } from './login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ShareService } from '../share/share.service';
import { of, Subscription } from 'rxjs';
import { finalize, mergeMap, tap } from 'rxjs/operators';
import { log, scrub } from '../app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  formGroup: FormGroup;
  formGroupSignUp: FormGroup;
  @HostBinding('class.handset')
  handset: boolean;
  signUp: boolean = false;
  private handsetSubscription: Subscription;

  constructor(private formBuilder: FormBuilder, private router: Router, private shareService: ShareService, private loginService: LoginService) {
    log(this).construct();
    this.formGroup = formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
    this.formGroupSignUp = formBuilder.group({
      fName: [null, Validators.required],
      lName: [null, Validators.required],
      email: [null, Validators.required]
    });
    this.handsetSubscription = shareService.handsetObserver.subscribe(handset => this.handset = handset);
  }

  onSubmit() {
    console.log(this.formGroup.get('username').value)
    console.log(this.formGroup.get('password').value)
    if (this.formGroup.get('username').value === 'faramond'  && this.formGroup.get('password').value === 'faramond@123') {
      this.router.navigate(['search']);
    }
  }

  onSignUp() {
    this.signUp = true;
  }

  onSubmitSignUp() {
    this.router.navigate(['dash'])
    localStorage['fName'] = this.formGroupSignUp.get('fName').value;
  }

  onCancel() {
    this.signUp = false;
    this.formGroupSignUp.reset();
  }

  ngOnDestroy(): void {
    this.handsetSubscription.unsubscribe();
  }

}
