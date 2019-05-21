import {NgModule} from '@angular/core';
import {ShareModule} from '../share/share.module';
import {LoginComponent} from './login.component';
import {LoginRoutingModule} from './login-routing.module';
import {LoginService} from './login.service';

@NgModule({
  imports: [ShareModule, LoginRoutingModule],
  declarations: [LoginComponent],
  providers: [LoginService]
})
export class LoginModule {

}
