import {Directive, ElementRef, OnInit} from '@angular/core';
import {log} from '../app';

@Directive({selector: '[appFocus]'})
export class FocusDirective implements OnInit {

  constructor(private hostElement: ElementRef) {
    log(this).construct();
  }

  ngOnInit() {
    this.hostElement.nativeElement.focus();
  }
}
