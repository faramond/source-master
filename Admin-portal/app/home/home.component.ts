import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Post} from './post.model';
import { HomeServiceService } from './home-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  form: FormGroup;
  selectedFile: File = null;
  constructor(private http: HttpClient, private homeservice: HomeServiceService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl('', Validators.required),
      image: new FormControl()
    });
    this.fetchPost();
  }

  get username() {
   return this.form.get('username');
  }

  onSelectFiles(event) {
    this.selectedFile = event.target.files[0];
  }
onSubmit() {
const fd = new FormData();
fd.append('image', this.selectedFile, this.selectedFile.name)
this.http
  .post('https://project-app-583cb.firebaseio.com/posts.json',
   fd)
    .subscribe(responseData => {
    console.log(responseData);
    });
  }
  onFetchPost() {
this.fetchPost();
  }
  private fetchPost() {
    this.http.get('https://project-app-583cb.firebaseio.com/posts.json')
    .subscribe(responseData => {
    console.log(responseData);
    });
  }
}
