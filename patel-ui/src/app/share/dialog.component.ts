import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {log} from '../app';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent implements OnInit {
  title: string;
  content: string;
  confirm: DialogComponentText;

  constructor(public dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    log(this).construct();
  }

  ngOnInit() {
    if (this.data) {
      Object.getOwnPropertyNames(this.data).forEach(prop => this[prop] = this.data[prop]);
    }
  }
}

export interface DialogComponentConfirm {
  title: string;
  content: string;
  confirm: DialogComponentText;
}

export interface DialogComponentText {
  confirm?: string;
  reject?: string;
}
