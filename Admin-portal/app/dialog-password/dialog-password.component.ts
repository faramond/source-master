import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ProjectNewsService } from '../services/project-news.service';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogCreateComponent } from '../dialog-create/dialog-create.component';

@Component({
  selector: 'app-dialog-password',
  templateUrl: './dialog-password.component.html',
  styleUrls: ['./dialog-password.component.css']
})
export class DialogPasswordComponent implements OnInit {
  form: FormGroup;
  saveEmail;
  newData;
  savePassword;
  constructor(public service: ProjectNewsService, public dialogRef: MatDialogRef<DialogCreateComponent>) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email : new FormControl(''),
      password: new FormControl(''),
      });
    }
    onSubmit(postData: {password: string }) {
      this.saveEmail = this.form.get('email').value;
      this.service.resetPass(this.saveEmail, postData)
      .subscribe(data => {
      this.newData=data;
      });
    }
    closeDialog() {
      this.dialogRef.close();
      }
    all(){
      this.closeDialog();
    }

}
