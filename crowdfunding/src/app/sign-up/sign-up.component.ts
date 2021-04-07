import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
 signUp:FormGroup;
 imgURL:any;
  constructor() { }

  ngOnInit(): void {
    this.signUp=new FormGroup({
      'first_name':new FormControl('',Validators.required),
      'last_name':new FormControl('',Validators.required),
      'email': new FormControl('',[Validators.required,Validators.email]),
      'mobile': new FormControl(''),
      'date': new FormControl(''),
      'password': new FormControl(''),
      'images': new FormControl(''),
      'address': new FormControl(''),
      'gender': new FormControl('')
      
    })
  }
  get firstName(){
    return this.signUp.get('first_name');
  }
  get lastName(){
    return this.signUp.get('last_name');
  }
  get email(){
    return this.signUp.get('email');
  }
onSelectFile(event){
  if (event.target.files && event.target.files[0]) {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = e => this.imgURL = reader.result;

    reader.readAsDataURL(file);
}
}
}
