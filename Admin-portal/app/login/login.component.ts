import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, EmailValidator, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit{
  hide = true;
  result;
  loginForm: FormGroup;
  isLogged: boolean;
  errorMessage: boolean;
  publish: {};
  breakpoint: number;
  text;

  constructor(public services: LoginService,
              private router: Router, private sharedService: SharedService,
              ) {}

    ngOnInit(): void {
    this.loginForm = new FormGroup({
    email : new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    });
  }
get email(){
 return this.loginForm.get('email');
}

get password(){
 return this.loginForm.get('password');
}

  onSubmit(postData: {email: string, password: string}) {
  this.services.login(postData);
  
  }

updateText(text) {
  this.sharedService.updateData(text);
}
}
