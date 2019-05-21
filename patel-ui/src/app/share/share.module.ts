import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule
} from '@angular/material';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ProgressComponent} from './share.service';
import {DialogComponent} from './dialog.component';
import {FocusDirective} from './focus.directive';
import {PrintComponent} from './print.component';
import {DebugDirective} from './debug.directive';
import {OverlayModule} from '@angular/cdk/overlay';
import {PortalModule} from '@angular/cdk/portal';
import {LayoutModule} from '@angular/cdk/layout';
import {ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from './auth-interceptor.service';
import {AuthGuardService} from './auth-guard.service';
import {StretchDirective} from './stretch.directive';

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    LayoutModule,
    PortalModule,
    OverlayModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    DebugDirective,
    FocusDirective,
    PrintComponent,
    MatTooltipModule,
    StretchDirective
  ],
  declarations: [
    ProgressComponent,
    DialogComponent,
    DebugDirective,
    FocusDirective,
    PrintComponent,
    StretchDirective
  ],
  entryComponents: [ProgressComponent, DialogComponent],
  providers: [AuthGuardService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  }]
})
export class ShareModule {
}
