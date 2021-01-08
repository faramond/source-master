import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  saved = {};
  result;
  retrieveData;
  emailData;
  name;
  creatorName;
  isLoggedin = JSON.parse(localStorage.getItem('LoggedIn') || 'false');
  retrieveEmail = localStorage.getItem('email');
  fullName=localStorage.getItem('name');
  _id;
  isLogged: boolean;
  errorMessage: boolean;
  constructor(private http: HttpClient, private router: Router) { }
  
  login(postData: {email: string, password: string}) {
   this.errorMessage = false;
   this.isLogged = false;
    return this.http.post('http://104.154.104.32:3000/tinnyBuzz/creator/login', postData)
    .subscribe(responseData => {
      this.result = responseData;
      this.creatorName=this.result.fullname;
      this.name=this.result.email;
      if (responseData ) {
        this.isLogged = true;
        this.loggedin(this.isLogged);
      localStorage.setItem('LoggedIn', this.isLoggedin.toString());
      localStorage.setItem('email',this.name);
      localStorage.setItem('name',this.creatorName);
      this.retrieveData=this.isLoggedin;
      this.retrieveEmail = localStorage.getItem('email');
      this.fullName=localStorage.getItem('name');
      if(this.result.role==="C"){
      this.router.navigate(['/news']);
    }
      else if(this.result.role==="A")
      this.router.navigate(['/admin']);
    } 
    else {
      this.isLogged = false;
      this.loggedin(this.isLogged);
    }
  }, error => {
    this.isLogged = false;
    this.errorMessage = true;
  });
}


loggedin(isLogged) {
  this.isLoggedin = isLogged;
}


  logout() {
    this.isLoggedin = false;
    localStorage.removeItem('LoggedIn');
    localStorage.removeItem('email');
    this.router.navigate(['/']);
    localStorage.clear();
  }
}
