import {Directive, TemplateRef, ViewContainerRef} from '@angular/core';
import {NgIf, NgIfContext} from '@angular/common';
import {log} from '../app';
import {environment} from '../../environments/environment';

@Directive({
  selector: '[appDebug]'
})
export class DebugDirective extends NgIf {
  constructor(viewContainer: ViewContainerRef, templateRef: TemplateRef<NgIfContext>) {
    super(viewContainer, templateRef);
    log(this).construct();
    this.ngIf = environment.debug;
  }
}
