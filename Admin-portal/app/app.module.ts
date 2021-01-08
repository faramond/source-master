import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {Routes, RouterModule} from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import 'chartjs-plugin-labels';
//import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import {  NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ProjectNewsComponent } from './project-news/project-news.component';
import { ViewComponent } from './view/view.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { EditingComponent } from './editing/editing.component';
import { LoginComponent } from './login/login.component';
import { SharedService } from './services/shared.service';
import { NotFoundComponent } from './not-found/not-found.component';
import { MatComponentModule } from './mat-component/mat-component.module';
import { AdminComponent } from './admin/admin.component';
import { SideNewsPostedComponent } from './side-news-posted/side-news-posted.component';
import { SidePendingComponent } from './side-pending/side-pending.component';
import { SideApprovedComponent } from './side-approved/side-approved.component';
import { DatePipe } from '@angular/common';
import { SideCreatorComponent } from './side-creator/side-creator.component';
import { DialogCreateComponent } from './dialog-create/dialog-create.component';
import { DialogEditComponent } from './dialog-edit/dialog-edit.component';
import { DialogPasswordComponent } from './dialog-password/dialog-password.component';
import { EmailComponent } from './email/email.component';



const appRoutes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'news' , component : ProjectNewsComponent},
  {path: 'admin', component: AdminComponent, children: [
  {path: '' , redirectTo: 'page-1', pathMatch: 'full'},
  {path: 'page-1', component: SideNewsPostedComponent},
  {path: 'page-2', component: SidePendingComponent},
  {path: 'page-3', component: SideApprovedComponent},
  {path: 'page-4', component: SideCreatorComponent}
  ]},
  {path: '**' , component: NotFoundComponent},
 // {path: '**' , redirectTo: '/not-found', pathMatch: 'full'}
  ];
@NgModule({
  declarations: [
    AppComponent,
    ProjectNewsComponent,
    ViewComponent,
    EditingComponent,
    AppComponent,
    ProjectNewsComponent,
    EditingComponent,
    ViewComponent,
    LoginComponent,
    NotFoundComponent,
    AdminComponent,
    SideNewsPostedComponent,
    SidePendingComponent,
    SideApprovedComponent,
    SideCreatorComponent,
    DialogCreateComponent,
    DialogEditComponent,
    DialogPasswordComponent,
    EmailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatComponentModule,
    SlickCarouselModule,
    ChartsModule,
    NgbModule,
    //FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [SharedService, LoginComponent, ProjectNewsComponent, DatePipe],
  bootstrap: [AppComponent],
  entryComponents: [EditingComponent, ProjectNewsComponent, ViewComponent , DialogCreateComponent , DialogEditComponent ]
})
export class AppModule { }
