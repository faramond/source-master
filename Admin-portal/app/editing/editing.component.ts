
import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProjectNewsService } from '../services/project-news.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Data } from '@angular/router';
import { LoginService } from '../services/login.service';
import { DomSanitizer } from '@angular/platform-browser';



@Component({
  selector: 'app-editing',
  templateUrl: './editing.component.html',
  styleUrls: ['./editing.component.css']
})
export class EditingComponent implements OnInit {
  public screenWidth: any;
  public screenHeight: any;

  selectedCategory = [];
  selectedLanguage: string;
  selectedCountry = [];
  countries: string;
  languages = [];
  selectedValue: string;
  images: File;
  form: FormGroup;
  urls = [];
  newImages = [];
  updated;
  pictures;
  recievedRow;
  wordCount;
  desCount;
  isbreakingNews;
  fileSource = [];
  image = [];
  isFetching: boolean;
  newData = [];
  myFile: [];
  fileName;
  blobObject;
  fileNames: FileList;
  output;
  file;
  fileArray: File[];
  newUrls = [];
  log;
  create;
  removeCategory;
  newArray = [];
  constructor( private postService: ProjectNewsService,
               private loginService: LoginService,
               public dialogRef: MatDialogRef<EditingComponent>,
               private matDialogBox: MatDialogRef<EditingComponent>,
               private sanitizer: DomSanitizer,
               @Inject(MAT_DIALOG_DATA) public data: any) {
   }
formData1: FormData;
temp = false;
Id: any;
Email: any;
result: any;
list;
updatedResult;


slideConfig = {
  slidesToShow: 1,
  slidesToScroll: 1,
  dots: true,
  adaptiveHeight: false,
  infinite: true

};

imageName = 'name.jpeg';
imageBlob;
imageFile;
fileList;
ngOnInit(): void {
  this.create = this.loginService.retrieveEmail;
  this.log = this.loginService.result;

  this.screenWidth = window.innerWidth;
  this.screenHeight = window.innerHeight;
  this.getOne();
  this.updated = this.loginService.retrieveEmail;
  this.postService.getCountry()
  .subscribe(result => {
  this.selectedCountry = [];
  for (const key in result) {
  this.selectedCountry.push(result[key]);
  }
  });

  this.postService.getCategory()
    .subscribe(result => {
    this.selectedCategory = [];
    this.removeCategory = [];
    for ( const key in result) {
    this.removeCategory.push(result[key]);
    this.removeCategory.splice(13,1);
    this.selectedCategory=this.removeCategory;
}
});
  this.selectedCategory = [];
  this.postService.getLanguage()
.subscribe(result => {
  this.languages = [];
  for (const key in result){
  this.languages.push(result[key]);
  }
});
  this.form = new FormGroup({
      news_title : new FormControl('', [Validators.required, this.wordLength.bind(this)]),
      news_description: new FormControl('', [Validators.required, this.desLength.bind(this)]),
      images: new FormControl(),
      isBreaking: new FormControl(),
      image_source: new FormControl('', Validators.required),
      news_source: new FormControl('', Validators.required),
      category_ID: new FormControl(),
      category_name: new FormControl(),
      updated_by: new FormControl(),
      language_ID: new FormControl(),
      country_ID: new FormControl(),
      news_url: new FormControl()
  });
  this.recievedRow = this.data.selectRow;
  this.Id = this.recievedRow.newsID;
  this.selectedValue = this.recievedRow.category_ID;
  this.countries = this.recievedRow.country_ID;
  this.selectedLanguage = this.recievedRow.language_ID;
  this.isbreakingNews = this.recievedRow.isBreaking;
  for (const key in this.recievedRow.images) {
  this.fileArray=[];
  this.recievedRow.images[key];
  
  this.postService.getImage(this.recievedRow.images[key])
  .subscribe(response => {
    this.createImageFromBlob(response);
    this.file=new File([response],this.imageName,{type:'image/jpeg'});
    this.fileArray.push(this.file);
    return this.fileArray as unknown as FileList;
  });
}
}

wordLength(control: FormControl): {[key: string]: any}{
  this.wordCount = ((control.value ||  '').match(/\S+/g) || []).length;
  return this.wordCount <= 13 ? null :
  {data: {maxWords: {limit: 13, actual : this.wordCount}}};
}
desLength(control: FormControl): {[key: string]: any}{
  this.desCount = ((control.value || '').match(/\S+/g) || []).length;
  return this.desCount <= 70 ? null :
  {length: {maxWord: {limit: 70, actual : this.desCount}}};
 }
get news_title(){
  return this.form.get('news_title');
}
get news_description(){
  return this.form.get('news_description');
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
getOne() {
this.postService.getId(this.recievedRow)
.subscribe(data => {
  this.result = data;
});
}
newsTitle() {
 return this.form.get('news_title');
}
saveToMainTable() {
    this.formData1 = new FormData();
    this.formData1.append('news_title', this.form.get('news_title').value);
    this.formData1.append('news_description', this.form.get('news_description').value);
    for (const key in this.fileSource){
    this.formData1.append('images', this.fileSource[key]);
   }
    for(const key in this.fileArray){
      this.formData1.append('images',this.fileArray[key]);
        }
    this.formData1.append('isBreaking', this.isbreakingNews);
    this.formData1.append('image_source', this.form.get('image_source').value);
    this.formData1.append('news_source', this.form.get('news_source').value);
    this.formData1.append('category_ID', this.selectedValue);
    this.formData1.append('updated_by', this.updated.email);
    this.formData1.append('language_ID', this.selectedLanguage);
    this.formData1.append('country_ID', this.countries);
    this.formData1.append('news_url', this.form.get('news_url').value);
}


changeClient(event) {
  this.selectedValue = event;
}
changeLanguage(event) {
this.selectedLanguage = event;
}
changeCountry(event){
this.countries = event;
}
closeDialog() {
this.dialogRef.close(this.formData1);
}
onClose(){
  this.dialogRef.close();
}
all() {
  this.saveToMainTable();
  this.closeDialog();
}
onSelectFile(event) {
  this.fileSource = event.target.files;
  const files = event.target.files;
  if (files) {
    for (const file of files) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
    this.urls.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }
}
}
removeImage(index) {
  this.fileArray = [];
  this.fileSource = [];
  this.urls.splice(index, 1);
  this.afterRemove();
}

afterRemove(){
  this.fileArray = [];
  for(const key in this.urls){
  this.file=new File([this.dataURItoBlob(this.urls[key])],this.imageName,{type:'image/jpeg'});
  this.fileArray.push(this.file);
    }
    return this.fileArray as unknown as FileList;
}

dataURItoBlob(dataURI) {
  const fileArray: File[] = [];
  const binary = atob(dataURI.split(',')[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
   array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], {
  type: 'image/jpg'
});
}
isBreakingNews(){
  this.isbreakingNews = !this.isbreakingNews;
}
}


