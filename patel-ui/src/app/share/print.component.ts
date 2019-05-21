import {Component, Input} from '@angular/core';
import {log} from '../app';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent {
  @Input()
  data: any;

  constructor() {
    log(this).construct();
  }
}
