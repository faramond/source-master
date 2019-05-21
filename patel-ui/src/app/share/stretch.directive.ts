import {Directive, HostBinding} from '@angular/core';
import {log} from '../app';

@Directive({selector: '[appStretch]'})
export class StretchDirective {
@HostBinding('style.flex-grow') flexGrow = 1;
  constructor() {
    log(this).construct();
  }
}
