import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DialogCreateComponent } from '../dialog-create/dialog-create.component';
import { DialogEditComponent } from '../dialog-edit/dialog-edit.component';
import { ProjectNewsService } from '../services/project-news.service';
import { LoginService } from '../services/login.service';
import { DialogPasswordComponent } from '../dialog-password/dialog-password.component';
import { MatPaginator } from '@angular/material/paginator';

export interface Element {
  fullname: string;
  email;
  role;
  edit: string;
  _id;
}


@Component({
  selector: 'app-side-creator',
  templateUrl: './side-creator.component.html',
  styleUrls: ['./side-creator.component.css']
})
export class SideCreatorComponent implements OnInit {
 updatedResult;
 isLoggedin;
  element: Element = {
    fullname: '',
    email: '',
    role: '',
    edit: '',
    _id: ''
  };
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor( public dialog: MatDialog,
     public service: ProjectNewsService,
      private matDialog: MatDialog,
      private loginService: LoginService) {}
  Element_data: any = [];
  create;
  isFetching: boolean;
  selection = new SelectionModel<Element>(true, []);
  data = Object.assign(this.Element_data);
  displayedColumns: string[] = ['Select' , 'fullname', 'email', 'role', 'edit'];
  dataSource = new MatTableDataSource<Element>(this.Element_data);
  
  ngOnInit(): void {
  this.create = this.loginService.retrieveEmail;
  this.isLoggedin = this.loginService.isLoggedin;
    this.fetchPost();
    this.deletingRow();
}
openDialog(): void {
  const dialogRef = this.dialog.open(DialogCreateComponent, {
    width: '600px', height: '620px',
    data: {}
  });

  dialogRef.afterClosed().subscribe(result => {
    this.fetchPost();
  });
}
resetDialog(){
  const dialogRef = this.dialog.open(DialogPasswordComponent, {
    width: '400px', height: '420px',
    data: {}
  });

  dialogRef.afterClosed().subscribe(result => {

    this.fetchPost();
  });
}


  fetchPost(){
    this.isFetching = true;
    this.service.getCreatorForm().subscribe(responseData => {
      this.isFetching = false;
      this.Element_data = [];
      for (const key in responseData) {
        if (responseData !== [] && responseData !== '' && responseData != null){
      if (responseData.hasOwnProperty(key)){
        this.Element_data.push(responseData[key]);
        this.dataSource = new MatTableDataSource(this.Element_data);
        }
      }
    }
      this.dataSource = new MatTableDataSource(this.Element_data);
      this.dataSource.paginator=this.paginator;
   }) 
}
  edit(row) {
    const dialogRef = this.dialog.open(DialogEditComponent, {
      width: '580px', height: '520px',
      data: {selectRow: row},
  });
  dialogRef.afterClosed().subscribe(result => {
    if(result !== undefined){

      this.service.updateRow(row._id, result)
      .subscribe(responseData => {
        this.updatedResult = responseData;
        if (responseData){
          this.fetchPost();
        }
      });
    }
    });
}
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected === numRows;
}
deletingRow() {
  for (const key in this.selection.selected) {
  const news = this.selection.selected[key]._id;
  console.log(news);
  this.service.deleteRow(news)
  .subscribe(data => {
  if (data){
  this.fetchPost();
}
});
}
}
masterToggle() {
  this.isAllSelected() ?
  this.selection.clear() :
  this.dataSource.data.forEach(row => this.selection.select(row));
  }
}