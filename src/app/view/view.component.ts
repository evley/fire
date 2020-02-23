import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CONSTANTS } from '../app.constant';
import { AppService } from '../app.service';
import { DataItem } from './+bubble-graph/data-item.interface';
import { Financial } from './financial.interface';

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
    fireReq: {
      name: CONSTANTS.financial.fireReq,
      value: 0
    },
    fireTime: {
      name: CONSTANTS.financial.fireTime,
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

  constructor(private _router: Router, private _appService: AppService) {
    this._appService.refreshData$.subscribe(() => {
      this._resetData();
      setTimeout(() => this._setData(), 100);
    });
  }

  public ngOnInit(): void {
    if (this._hasData()) {
      this._setData();
    } else {
      this._goToDefault();
    }
  }

  public get hasItems(): boolean {
    return this.items.length > 0;
  }

  private _hasData(): boolean {
    return Boolean(this._getData());
  }

  private _resetData(): void {
    this.items = [];
  }

  private _setData(): void {
    const data = this._getData();
    const dataIitems = this._buildDataItems(data);
    this._setFinancials(dataIitems);
    this.items = this._prepareForGraph(dataIitems);
  }

  private _dataItemSummary(): DataItem {
    return {
      key: true,
      name: 'Summary',
      image: '',
      icon: '',
      impact: 0,
      income: 0,
      expenditure: 0,
      essential: false,
      liability: 0,
      assets: 0,
      value: 0
    };
  }

  private _getData(): object[] {
    return JSON.parse(window.localStorage.getItem(CONSTANTS.appId));
  }

  private _prepareForGraph(items: DataItem[]): DataItem[] {
    const itemsWithImpact = items.map((item) => ({ ...item, impact: this._calculateImpact(item) }));
    const itemsWithValue = itemsWithImpact.map((item) => ({
      ...item,
      value: this._calculateValue(itemsWithImpact, item)
    }));
    return [...itemsWithValue, this._dataItemSummary()];
  }

  private _calculateValue(items: DataItem[], item: DataItem): number {
    const maxImpact = Math.max(...items.map((i) => i.impact).filter((i) => isFinite(i)));
    const value = isFinite(item.impact)
      ? item.impact < 0
        ? Math.abs(item.impact)
        : item.impact
      : maxImpact * 3;
    return value;
  }

  private _calculateImpact(item: DataItem): number {
    const { fireReq, profit, income, expenditure } = this.financial;
    return parseFloat(
      (item.income > 0
        ? income.value - item.income > expenditure.value
          ? fireReq.value / profit.value -
            fireReq.value / (income.value - item.income - expenditure.value)
          : -Infinity
        : fireReq.value / profit.value -
          (fireReq.value - (item.essential ? item.expenditure * CONSTANTS.fireMultiplier : 0)) /
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
        this.financial.fireReq.value += item.expenditure * CONSTANTS.fireMultiplier;
      });
    this.financial.profit.value = this.financial.income.value - this.financial.expenditure.value;
    this.financial.fireReq.value =
      this.financial.fireReq.value + (this.financial.liability.value - this.financial.assets.value);
    this.financial.fireTime.value = this.financial.fireReq.value / this.financial.profit.value;
  }

  private _resetFinancials(): void {
    Object.keys(this.financial).map((item) => (this.financial[item].value = 0));
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
