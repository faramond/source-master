import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ProjectNewsService } from '../services/project-news.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { EditingComponent } from '../editing/editing.component';
import { ViewComponent } from '../view/view.component';
import { LoginService } from '../services/login.service';
import {MatPaginator} from '@angular/material/paginator';

export interface Element {
  newsID: string;
  NewsTitle: string;
  PostedBy: string;
  Edit: string;
  View: string;
  CategoryName: string;
  _id: string;
}

@Component({
  selector: 'app-side-pending',
  templateUrl: './side-pending.component.html',
  styleUrls: ['./side-pending.component.css']
})

export class SidePendingComponent implements OnInit {
output = [];
isFetching = false;
element: Element = {
  newsID: '',
  CategoryName: '',
  NewsTitle: '',
  Edit: '',
  PostedBy: '',
  View: '',
  _id: ''
};
Element_data = [];
isEdited = false;
updatedResult;
deleted;
newsApproved;
isLoggedin;
create;
@ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private service: ProjectNewsService,
              private matDialog: MatDialog, public loginService:LoginService) { }
  selection = new SelectionModel<Element>(true, []);
  columnsToDisplay: string[] = ['Select', 'NewsID', 'CategoryName', 'NewsTitle', 'PostedBy', 'Edit', 'View'];

  dataSource1 = new MatTableDataSource<Element>(this.Element_data);
  data = Object.assign(this.Element_data);

  ngOnInit(): void {
    this.isLoggedin = this.loginService.isLoggedin;
    this.create = this.loginService.retrieveEmail;
    this.onfetchPost();
  }
 
  onfetchPost() {
    this.isFetching = true;
    this.service.getPendingNews()
    .subscribe(responseData => {
    this.isFetching = false;
    this.Element_data = [];

    if (responseData !== [] && responseData !== '' && responseData != null){
      if (responseData instanceof Array){
      for (const key in responseData) {
        this.Element_data.push(responseData[key]);
        this.dataSource1 = new MatTableDataSource(this.Element_data);
        }
      }
    }
    this.dataSource1 = new MatTableDataSource(this.Element_data);
      this.dataSource1.paginator=this.paginator;
  });
}

editPost(row) {
  const dialogRef = this.matDialog.open(EditingComponent, {
  width: '850px', height: '685px',
  data: {selectRow: row},
  });
  dialogRef.afterClosed().subscribe(result => {
    this.service.onUpdate(row.newsID, result)
        .subscribe(responseData => {
        this.updatedResult = responseData;
          if (responseData){
            this.onfetchPost();
          }
        });
      
    });
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
  onApprove(){
      for (const key in this.selection.selected) {
         const Id = this.selection.selected[key]._id;
         this.service.approveNews(Id)
           .subscribe(data => {
        for (const key in data){
        this.output.push(data[key]);
    }
        if (data){
        this.onfetchPost();
}
});
    }
    }
  masterToggle() {
    this.isAllSelected() ?
    this.selection.clear() :
    this.dataSource1.data.forEach(row => this.selection.select(row));
    }


}
