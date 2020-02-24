import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CONSTANTS } from './app.constant';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public importName = CONSTANTS.appId;
  public importMethods = CONSTANTS.importMethods;
  public templateLink = CONSTANTS.templateLink;

  constructor(private _router: Router, private _appService: AppService) {}

  public ngOnInit(): void {
    if (this.hasData) {
      this._goToView();
    } else {
      this._goToDefault();
    }
  }

  public get hasData(): boolean {
    return Boolean(window.localStorage.getItem(CONSTANTS.appId));
  }

  public onImportClosed(imported: boolean): void {
    if (imported) {
      this._goToView();
      this._appService.refreshData$.next();
    }
  }

  private _goToView(): void {
    this._router.navigate(['view']);
  }

  private _goToDefault(): void {
    this._router.navigate(['/']);
  }
}
