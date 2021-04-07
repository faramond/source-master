import { Component, OnInit } from '@angular/core';
import { EmailValidator, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  loginForm:FormGroup;
  constructor() { }

  ngOnInit(): void {
    this.loginForm=new FormGroup({
      'email':new FormControl('',[Validators.required]),
      'password': new FormControl('',[Validators.required])
    });

    
  }
get email(){
  return this.loginForm.get('email');
}
get password() {
  return this.loginForm.get('password');
}
}
