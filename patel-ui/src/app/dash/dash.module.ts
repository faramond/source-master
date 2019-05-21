import {NgModule} from '@angular/core';
import {DashComponent} from './dash.component';
import {DashRoutingModule} from './dash-routing.module';
import {DashService} from './dash.service';
import {ShareModule} from '../share/share.module';
import { MatListModule } from '@angular/material/list';

@NgModule({
  imports: [ShareModule, DashRoutingModule, MatListModule],
  declarations: [DashComponent],
  providers: [DashService]
})
export class DashModule {

}
