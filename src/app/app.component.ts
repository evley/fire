import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CONSTANTS } from './app.constant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public importName = CONSTANTS.appId;
  public importMethods = CONSTANTS.importMethods;

  constructor(private _router: Router) {}

  public ngOnInit(): void {
    if (this.hasData()) {
      this._goToView();
    } else {
      this._goToDefault();
    }
  }

  public hasData(): boolean {
    return Boolean(window.localStorage.getItem(CONSTANTS.appId));
  }

  private _goToView(): void {
    this._router.navigate(['view']);
  }

  private _goToDefault(): void {
    this._router.navigate(['/']);
  }
}
