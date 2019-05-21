import { Component, Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { DialogComponent, DialogComponentConfirm } from './dialog.component';
import { log } from '../app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cart } from '../search/search'

@Component({
  selector: 'app-spinner',
  template: '<mat-spinner></mat-spinner>'
})
export class ProgressComponent {
}

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  handsetObserver: Observable<boolean>;
  private spinnerRef: OverlayRef;
  private spinners = 0;
  cart: Cart[] = []; 
  username: string;
  redirect: string;
  check: boolean = false;

  constructor(breakpointObserver: BreakpointObserver, private overlay: Overlay, private matSnackBar: MatSnackBar, private matDialog: MatDialog,
  ) {
    log(this).construct();
    this.handsetObserver = breakpointObserver.observe(Breakpoints.Handset).pipe(
      map(result => result.matches)
    );
    this.username = 'test';
  }

  spinner() {
    return {
      start: (): void => {
        this.spinners++;
        if (this.spinners > 1) {
          return;
        }
        this.spinnerRef = this.overlay.create({
          positionStrategy: this.overlay.position().global(),
          width: '100%',
          panelClass: 'app-progress'
        });
        this.spinnerRef.attach(new ComponentPortal(ProgressComponent));
      },
      stop: (): void => {
        this.spinners--;
        if (this.spinners > 0) {
          return;
        }
        if (this.spinners < 0) {
          this.spinners = 0;
        }
        this.spinnerRef.dispose();
      }
    };
  }

  snack(message: string): MatSnackBarRef<SimpleSnackBar> {
    const config: MatSnackBarConfig = new MatSnackBarConfig();
    config.duration = 2000;
    return this.matSnackBar.open(message, 'OK', config);
  }

  dialog() {
    const base = (data: DialogComponentConfirm) => {
      const config = new MatDialogConfig();
      config.data = data;
      config.disableClose = true;
      return this.matDialog.open(DialogComponent, config);
    };
    return {
      confirm: (data: DialogComponentConfirm): MatDialogRef<DialogComponent> => base(data),
      update: (what: string): MatDialogRef<DialogComponent> => base({
        title: 'Update ' + what,
        content: 'Confirm',
        confirm: { confirm: 'YES', reject: 'NO' }
      }),
      delete: (what: string): MatDialogRef<DialogComponent> => base({
        title: 'Delete ' + what,
        content: 'Confirm',
        confirm: { confirm: 'YES', reject: 'NO' }
      })
    };
  }

  getAllState() {
    return;
  }

}
