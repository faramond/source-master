import { NgModule } from '@angular/core';
import { ShareModule } from '../share/share.module';
import { NavComponent } from './nav.component';
import { NavRoutingModule } from './nav-routing.module';
import { MatListModule } from '@angular/material/list';


@NgModule({
  imports: [ShareModule, NavRoutingModule, MatListModule],
  declarations: [NavComponent],
  providers: []
})
export class NavModule {

}
