import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { CONSTANTS } from '../../app.constant';
import { FinanceGroup, Financial } from './financial.interface';

const negativeList = [CONSTANTS.financial.debt, CONSTANTS.financial.expenditure];

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input()
  public currency: string = 'GBP';
  @Input()
  public financial: Financial;

  public importName = CONSTANTS.appId;
  public importMethods = CONSTANTS.importMethods;

  constructor(private _router: Router) {}

  public get financialKeys(): any[] {
    return Object.keys(this.financial);
  }

  public isPositive(item: FinanceGroup): boolean {
    return this._isInNegativeList(item.name) ? item.value === 0 : item.value > 0;
  }

  public isNegative(item: FinanceGroup): boolean {
    return this._isInNegativeList(item.name) ? item.value !== 0 : item.value <= 0;
  }

  private _isInNegativeList(name: string): boolean {
    return negativeList.indexOf(name.toLowerCase()) > -1;
  }
}
