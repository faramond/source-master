import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectNewsService } from '../services/project-news.service';

interface Items{
  value;
  role;
}
@Component({
  selector: 'app-dialog-edit',
  templateUrl: './dialog-edit.component.html',
  styleUrls: ['./dialog-edit.component.css']
})
export class DialogEditComponent implements OnInit {
  imageName = 'name.jpeg';
  creatorForm: FormGroup;
  formData: FormData;
  selectedRole;
  fileSource: File;
  imageSrc;
  recievedRow;
  ID;
  file;
  fileArray: [] = [];
  constructor(public dialogRef: MatDialogRef<DialogEditComponent>, 
      @Inject(MAT_DIALOG_DATA) public data: any,
      public service:ProjectNewsService) { }
  items: Items[] = [
    {value: 'A', role: 'Admin'},
    {value: 'C', role: 'Creator'}
  ];
  ngOnInit(): void {
    this.recievedRow = this.data.selectRow;
    this.ID = this.recievedRow._id;
    this.selectedRole = this.recievedRow.role;
     this.recievedRow.image;

   this.service.getImage(this.recievedRow.image)
   .subscribe(response => {
     this.createImageFromBlob(response);
     this.file=new File([response],this.imageName,{type:'image/jpeg'});
     this.fileArray=this.file;
     return this.fileArray as unknown as FileList;
   })

    this.creatorForm = new FormGroup({
      fullname: new FormControl(),
      email: new FormControl(),
      role: new FormControl(),
      image: new FormControl(),
      password: new FormControl()
    });
  }
  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
    this.imageSrc = reader.result;
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  saveToMainTable(){
    this.formData = new FormData();
    this.formData.append('fullname', this.creatorForm.get('fullname').value);
    this.formData.append('email', this.creatorForm.get('email').value);
    this.formData.append('role', this.selectedRole);
    this.formData.append('password', this.creatorForm.get('password').value);
    this.formData.append('image', this.fileSource);
    for(const key in this.fileArray){
      this.formData.append('image',this.fileArray[key]);
        }
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
  removeImage(){
  this.imageSrc = '';
  }
  changeData(event){
  this.selectedRole = event;
  }
 
  closeDialog() {
    this.dialogRef.close(this.formData);
    }
    onClose(){
      this.dialogRef.close();
    }
    all() {
      this.saveToMainTable();
      this.closeDialog();
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
}
