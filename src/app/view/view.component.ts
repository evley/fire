import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// TODO:
// import * as d3 from 'd3';

import { CONSTANTS } from '../app.constant';
import { DataItem } from './+data-item/data-item.interface';
import { Financial } from './+header/financial.interface';

const booleanList = [CONSTANTS.financial.essential];
const numberList = [
  CONSTANTS.financial.income,
  CONSTANTS.financial.expenditure,
  CONSTANTS.financial.liability,
  CONSTANTS.financial.assets
];

@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  public items: DataItem[] = [];
  public financial: Financial = {
    income: {
      name: CONSTANTS.financial.income,
      value: 0
    },
    expenditure: {
      name: CONSTANTS.financial.expenditure,
      value: 0
    },
    profit: {
      name: CONSTANTS.financial.profit,
      value: 0
    },
    FIRE: {
      name: CONSTANTS.financial.FIRE,
      value: 0
    },
    liability: {
      name: CONSTANTS.financial.liability,
      value: 0
    },
    assets: {
      name: CONSTANTS.financial.assets,
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
    const dataIitems = this._buildDataItems(data);
    this._setFinancials(dataIitems);
    this.items = this._setImpact(dataIitems);
    console.log('#### data', this.items);
  }

  private _getData(): object[] {
    return JSON.parse(window.localStorage.getItem(CONSTANTS.appId));
  }

  private _setImpact(items: DataItem[]): DataItem[] {
    return items
      .map((item) => ({ ...item, impact: this._calculateImpact(item) }))
      .sort(this._sortByImpact);
  }

  private _calculateImpact(item: DataItem): number {
    const { FIRE, profit, income, expenditure } = this.financial;
    return parseFloat(
      (item.income > 0
        ? income.value - item.income > expenditure.value
          ? FIRE.value / profit.value -
            FIRE.value / (income.value - item.income - expenditure.value)
          : -Infinity
        : FIRE.value / profit.value -
          (FIRE.value - (item.essential ? item.expenditure * CONSTANTS.fireMultiplier : 0)) /
            (item.expenditure + profit.value)
      ).toFixed(2)
    );
  }

  private _setFinancials(items: DataItem[]): void {
    this._resetFinancials();
    items
      .map((item) => {
        this.financial.income.value += item.income || 0;
        this.financial.expenditure.value += item.expenditure || 0;
        this.financial.liability.value += item.liability || 0;
        this.financial.assets.value += item.assets || 0;
        return item;
      })
      .filter((item) => item.essential && item.expenditure > 0)
      .map((item) => {
        this.financial.FIRE.value += item.expenditure * CONSTANTS.fireMultiplier;
      });
    this.financial.profit.value = this.financial.income.value - this.financial.expenditure.value;
  }

  private _resetFinancials(): void {
    Object.keys(this.financial).map((item) => (this.financial[item].value = 0));
  }

  private _sortByImpact(a: DataItem, b: DataItem): number {
    return b.impact - a.impact;
  }

  private _buildDataItems(data: object[]): DataItem[] {
    const headers = Object.keys(data[0]).map((header) => header.toLowerCase());
    return data
      .map((value) => {
        const item = {} as DataItem;
        headers.map((header) => (item[header] = this._handleItemValue(header, value[header])));
        return item;
      })
      .filter((item) => !!item.name);
  }

  private _handleItemValue(header: string, value: string): string | number | boolean {
    const isInList = (list: string[]) => list.indexOf(header) > -1;

    if (value) {
      if (isInList(booleanList)) {
        return value && Number(value) > 0;
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
