import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ProjectNewsService } from '../services/project-news.service';

interface Items{
  value;
  role;
}

@Component({
  selector: 'app-dialog-create',
  templateUrl: './dialog-create.component.html',
  styleUrls: ['./dialog-create.component.css']
})
export class DialogCreateComponent implements OnInit {
  creatorForm: FormGroup;
  selectedValue;
  imageSrc;
  fileSource: File;
  formData: FormData;
  constructor(private service: ProjectNewsService , public dialogRef: MatDialogRef<DialogCreateComponent>,) { }
  items: Items[] = [
    {value: 'A', role: 'Admin'},
    {value: 'C', role: 'Creator'}
  ];
  ngOnInit(): void {
    this.creatorForm = new FormGroup({
      fullname: new FormControl(),
      email: new FormControl(),
      role: new FormControl(),
      image: new FormControl(),
      password: new FormControl()
    });
  }
  onSubmit(formData: FormData){
    this.formData = new FormData();
    this.formData.append('fullname', this.creatorForm.get('fullname').value);
    this.formData.append('email', this.creatorForm.get('email').value);
    this.formData.append('role', this.selectedValue);
    this.formData.append('password', this.creatorForm.get('password').value);
    this.formData.append('image', this.fileSource);
    this.service.creatorForm(this.formData)
    .subscribe(data => {
      if (data != null){
        data;

      }
     // const result = data;
     // console.log(result);
    });
  }

  onSelectFile(event) {
    this.fileSource = event.target.files[0];
  
    if (event.target.files && event.target.files[0]) {
      
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;

      reader.readAsDataURL(file);
  }
}
changeData(event){
  this.selectedValue=event;

}
closeDialog() {
  this.dialogRef.close(this.formData);
  }
all(){
  this.closeDialog();
}
}
