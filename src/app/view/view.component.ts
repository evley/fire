import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CONSTANTS } from '../app.constant';
import { DataItem } from './+data-item/data-item.interface';
import { Financial } from './+header/financial.interface';

const splitByCommaList = [CONSTANTS.positive, CONSTANTS.negative];
const numberList = [
  CONSTANTS.impact,
  CONSTANTS.financial.income,
  CONSTANTS.financial.expenditure,
  CONSTANTS.financial.debt,
  CONSTANTS.financial.savings
];

@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  public items: DataItem[] = [];
  public currency = CONSTANTS.financial.currency;
  public financial: Financial = {
    income: {
      name: CONSTANTS.financial.income,
      active: true,
      value: 0
    },
    expenditure: {
      name: CONSTANTS.financial.expenditure,
      active: true,
      value: 0
    },
    profit: {
      name: CONSTANTS.financial.profit,
      active: true,
      value: 0
    },
    debt: {
      name: CONSTANTS.financial.debt,
      active: true,
      value: 0
    },
    savings: {
      name: CONSTANTS.financial.savings,
      active: true,
      value: 0
    }
  };

  constructor(private _router: Router) {}

  public ngOnInit(): void {
    if (this._hasData()) {
      this._setData();
    } else {
      this._goToDefault();
    }
  }

  private _hasData(): boolean {
    return Boolean(this._getData());
  }

  private _setData(): void {
    const data = this._getData();
    this.items = this._buildItems(data);
    this._buildFinancials(this.items);
  }

  private _getData(): object[] {
    return JSON.parse(window.localStorage.getItem(CONSTANTS.appId));
  }

  private _buildFinancials(items: DataItem[]): void {
    this._resetFinancials();
    items.map((item) => {
      this.financial.income.value += item.income || 0;
      this.financial.expenditure.value += item.expenditure || 0;
      this.financial.debt.value += item.debt || 0;
      this.financial.savings.value += item.savings || 0;
    });
    this.financial.profit.value = this.financial.income.value - this.financial.expenditure.value;
  }

  private _resetFinancials(): void {
    Object.keys(this.financial).map((item) => (this.financial[item].value = 0));
  }

  private _sortByImpact(a: DataItem, b: DataItem): number {
    return b.impact - a.impact;
  }

  private _buildItems(data: object[]): DataItem[] {
    const headers = Object.keys(data[0]).map((header) => header.toLowerCase());
    return data
      .map((value) => {
        const item = {} as DataItem;
        headers.map((header) => (item[header] = this._handleItemValue(header, value[header])));
        item.active = true;
        // TODO: Impact on FIRE time
        item.impact = 1;
        return item;
      })
      .sort(this._sortByImpact);
  }

  private _handleItemValue(header: string, value: string): string | string[] | number {
    const isInList = (list: string[]) => list.indexOf(header) > -1;

    if (value) {
      if (isInList(splitByCommaList)) {
        return value.toString().split(',');
      } else if (isInList(numberList)) {
        return value ? Number(value) : 0;
      } else {
        return value;
      }
    }
  }

  private _goToDefault(): void {
    this._router.navigate(['/']);
  }
}
