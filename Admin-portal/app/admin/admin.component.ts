import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
create;
adminName;
clicked;
  constructor(public loginService: LoginService, private router: Router) { }
  isLoggedin = this.loginService.isLoggedin;
  ngOnInit(): void {
    this.create = this.loginService.retrieveEmail;
    this.clicked = this.loginService.fullName;
  }
 
  logoutUser(){
    this.loginService.logout();
  }
}
