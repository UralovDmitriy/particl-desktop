import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Log } from 'ng2-logger';


import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { UnlockwalletComponent } from 'app/modals/unlockwallet/unlockwallet.component';
import { ModalsConfig } from './models/modals.config.interface';

interface ModalsSettings {
    disableClose: boolean;
    width: string;
    height: string;
    panelClass: string
}

@Injectable()
export class ModalsHelperService implements OnDestroy {

  // @TODO replace ModalsHelperService with ModalsService.

  private log: any = Log.create('modals.service');
  private destroyed: boolean = false;
  private modelSettings: ModalsSettings = {
    disableClose: true,
    width: '100%',
    height: '100%',
    panelClass: 'cdk-modal-full'
  };

  constructor (
    private _dialog: MatDialog
  ) { }

  /**
    * Unlock wallet
    * @param {ModalsConfig} data       Optional - data to pass through to the modal.
    */

  unlock(data: ModalsConfig, callback?: Function) {
    const dialogRef = this._dialog.open(UnlockwalletComponent, this.modelSettings);
    if (!!data || callback) {
      dialogRef.componentInstance.setData(data, callback);
    }
    dialogRef.afterClosed().subscribe(() => {
      this.log.d('unlock modal closed');
    });
  }

  ngOnDestroy() {
    this.destroyed = true;
  }

}
