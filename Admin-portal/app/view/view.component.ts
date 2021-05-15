import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MatDialogRef , MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProjectNewsService } from '../services/project-news.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  public screenWidth: any;
  public screenHeight: any;
  images: File;
  image;
  urls = [];
  recievedRow: any;
  result: any;
  resultArray: any = [];
  form: FormGroup;
  Id: any;
  fileSource: File;

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    adaptiveHeight: false,
    infinite: true
    };
  constructor(private matDialogBox: MatDialogRef<ViewComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private postService: ProjectNewsService) { }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  
    this.form = new FormGroup({
      news_title : new FormControl('', Validators.required),
      news_description: new FormControl('', Validators.required),
      images: new FormControl(),
      image_source: new FormControl('', Validators.required),
      news_source: new FormControl('', Validators.required),
      newsID: new FormControl(),
      category_name: new FormControl(),
      language_name: new FormControl(),
      news_url: new FormControl(),
      country_name: new FormControl()

  });

    this.recievedRow = this.data.selectRow;
    this.Id = this.recievedRow.newsID;
    for (const key in this.recievedRow.images) {
       this.image = this.recievedRow.images[key];
      this.postService.getImage(this.image)
      .subscribe(response => {
        this.createImageFromBlob(response);
      });
    }

    this.getOne();
}
createImageFromBlob(image: Blob) {
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    this.urls.push(reader.result);
  }, false);
  if (image) {
    reader.readAsDataURL(image);
  }
}
@HostListener('window:resize', ['$event'])
onResize(event) {
  this.screenWidth = window.innerWidth;
  this.screenHeight = window.innerHeight;
}

getOne() {
this.postService.getId(this.recievedRow)
.subscribe(data => {
  this.result = data;
});
}

}
