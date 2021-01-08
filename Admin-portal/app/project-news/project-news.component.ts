import { Component, OnInit, HostListener, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {FormGroup, FormControl, Validators, Form, FormGroupDirective} from '@angular/forms';
import { ProjectNewsService } from '../services/project-news.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { EditingComponent } from '../editing/editing.component';
import { SelectionModel } from '@angular/cdk/collections';
import { ViewComponent } from '../view/view.component';
import { MatOptionSelectionChange } from '@angular/material/core';
import { SharedService } from '../services/shared.service';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { LoginService } from '../services/login.service';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { Users } from '../users';
import {MatPaginator} from '@angular/material/paginator';


export interface Element {
  newsID: string;
  NewsTitle: string;
  PostedBy: string;
  Edit: string;
  View: string;
  CategoryName: string;
  isApproved;
  email;
}


@Component({
  selector: 'app-project-news',
  templateUrl: './project-news.component.html',
  styleUrls: ['./project-news.component.css']
})
export class ProjectNewsComponent implements OnInit{
@ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
@ViewChild('slickModal') slickModal: SlickCarouselComponent;


countries = [];
users: Users[];
languages = [];
selectedCategory = [];
selectedValue: string;
selectedCountry: string;
selectedLanguage: string;
updatedResult;
newCategory;
isEdited = false;
deleted;
breakingNews;
email;
wordCount: number;
desCount: number;
approveData;
updatingdata;

element: Element = {
  newsID: '',
  CategoryName: '',
  NewsTitle: '',
  Edit: '',
  PostedBy: '',
  View: '',
  isApproved: '',
  email: ''
};
slideConfig = {
  slidesToShow: 1,
  slidesToScroll: 1,
  dots: true,
  adaptiveHeight: false,
  infinite: true
};
@ViewChild(MatPaginator) paginator: MatPaginator;
constructor(private postServices: ProjectNewsService,
            private matDialog: MatDialog,
            private sharedService: SharedService,
            private login: LoginComponent, public serviceLogin: LoginService,
            private router: Router) {}
  text = '';
  create = '';
  urls = [];
  mainForm: FormGroup;
  isFetching: boolean;
  fileSource: [] = [];
  modifiedText: string;
  error = null;

      isLoggedin = this.serviceLogin.isLoggedin;
      Element_data: any = [];
      emailInfo;


      selection = new SelectionModel<Element>(true, []);
      columnsToDisplay: string[] = ['Select', 'NewsID', 'CategoryName', 'NewsTitle', 'PostedBy', 'Edit', 'View', 'Approve'];

      dataSource1 = new MatTableDataSource<Element>(this.Element_data);
      data = Object.assign(this.Element_data);
      ngOnInit() {
  
        this.create = this.serviceLogin.retrieveEmail;

        this.languageName();
        this.postServices.getLanguage()
        .subscribe(result => {
          this.languages = [];
          for (const key in result){
           this.languages.push(result[key]);
          }
        });
        this.postServices.getCountry()
        .subscribe(result => {
  this.countries = [];
  for (const key in result) {
    this.countries.push(result[key]);
  }
});
        this.postServices.getCategory()
.subscribe(result => {

  this.selectedCategory = [];
  this.newCategory = [];
  for ( const key in result) {
    this.newCategory.push(result[key]);
    this.newCategory.splice(13, 1);
    this.selectedCategory = this.newCategory;
  }
});
        

      this.mainForm = new FormGroup({

        news_title : new FormControl('', [ Validators.required, this.wordLength.bind(this)]),
        news_description: new FormControl('', [Validators.required, this.desLength.bind(this)]),
         isBreaking: new FormControl(),
         images: new FormControl('', Validators.required),
         image_source: new FormControl('', Validators.required),
         news_source: new FormControl('', Validators.required),
         created_by: new FormControl(),
         category_ID: new FormControl('', Validators.required),
         category_name: new FormControl(),
         country_ID: new FormControl('', Validators.required),
         language_name: new FormControl(),
         language_ID : new FormControl('', Validators.required),
         news_url: new FormControl('', Validators.required),
      
      });
              this.onfetchPost(this.create);
      
      
      }
      
        get news_title() {
        return this.mainForm.get('news_title');
      }
      desLength(control: FormControl): {[key: string]: any}{
        this.desCount = ((control.value || '').match(/\S+/g) || []).length;
        return this.desCount <= 70 ? null :
        {'length': {maxWord: {limit: 70, actual : this.desCount}}}
       }
        get news_description() {
        return this.mainForm.get('news_description');
        }
      
        get image_source() {
        return this.mainForm.get('image_source');
      }
      
        get news_source() {
        return this.mainForm.get('news_source');
        }
        get newsID() {
          return this.mainForm.get('newsID');
        }
        get news_url() {
          return this.mainForm.get('news_url');
        }
        get category_ID() {
          return this.mainForm.get('category_ID');
        }
        get language_ID() {
          return this.mainForm.get('language_ID');
        }
        get country_ID(){
          return this.mainForm.get('country_ID');
        }
        get isBreaking(){
          return this.mainForm.get('isBreaking');
        }
        add() {
          this.selectedValue;
        }
        wordLength(control: FormControl): {[key: string]: any}{
          this.wordCount = ((control.value ||  '').match(/\S+/g) || []).length;
          return this.wordCount <= 13 ? null :
          {'data': {maxWords: {limit: 13, actual : this.wordCount}}}
          }
  onSubmit(formData: FormData) {
    formData = new FormData();
    formData.append('news_title', this.mainForm.get('news_title').value);
    formData.append('news_description', this.mainForm.get('news_description').value);
    formData.append('image_source', this.mainForm.get('image_source').value);
    formData.append('news_source', this.mainForm.get('news_source').value);
    for (const key in this.fileSource) {
      formData.append('images', this.fileSource[key]);
    }
    formData.append('isBreaking', this.breakingNews);
    formData.append('created_by', this.create);
    formData.append('category_ID', this.selectedValue);
    formData.append('country_ID', this.selectedCountry);
    formData.append('language_ID', this.selectedLanguage);
    formData.append('news_url', this.mainForm.get('news_url').value);

    this.postServices.onCreatePost(formData)
    .subscribe(responseData => {
      if (responseData != null){
      const postResult = responseData;
      if (postResult) {
        this.onfetchPost(this.create);
        }
      }
  });

}
onfetchPost(email) {
  this.isFetching = true;
  this.postServices.fetchPost(email).subscribe(responseData => {
  this.isFetching = false;
  this.Element_data = [];
  if (responseData !== [] && responseData !== '' && responseData != null){
    if (responseData instanceof Array){
      for (const key in responseData) {
      this.Element_data.push(responseData[key]);
      this.dataSource1 = new MatTableDataSource(this.Element_data);
      this.mainForm.reset();
        this.onRemoveImages();
        this.formGroupDirective.resetForm();
    
      }
  }
}
  this.dataSource1 = new MatTableDataSource(this.Element_data);
  this.dataSource1.paginator=this.paginator;
});
  this.breakingNews = false;
}
editPost(row) {
  const dialogRef = this.matDialog.open(EditingComponent, {disableClose: false,
    width: '800px', height: '680px',
    data: {selectRow: row},
});
  dialogRef.afterClosed().subscribe(result => {
  this.postServices.onUpdate(row.newsID, result)
  .subscribe(responseData => {
  this.updatedResult = responseData;
   if (responseData){
this.onfetchPost(this.create);
}
});
});
  this.breakingNews = false;
}

viewDialog(row) {
   const dialog = this.matDialog.open(ViewComponent, {
    width: '800px', height: '685px',
    data: { selectRow: row}
  });
   dialog.afterClosed().subscribe(result => {
   this.deleted = result;
  });
}
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource1.data.length;
  return numSelected === numRows;
}
deletingRow() {
  for (const key in this.selection.selected) {
  const news = this.selection.selected[key].newsID;
  this.postServices.onDelete(news)
  .subscribe(data => {
  if (data){
  this.onfetchPost(this.create);
}
});
}
}
masterToggle() {
this.isAllSelected() ?
this.selection.clear() :
this.dataSource1.data.forEach(row => this.selection.select(row));
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
onRemoveImages(){
  this.urls = [];

}
changeClient(event) {
  this.selectedValue;
}
changeCountry(event) {
  this.selectedCountry;

}
changeLanguage(event) {
  this.selectedLanguage;
}
logoutUser() {
  this.serviceLogin.logout();
}
languageName() {
  this.postServices.getLanguageName(name)
  .subscribe(result => {
    const name = result;
});
}
isBreakingNews(){
 this.breakingNews = !this.breakingNews;
}
}
