import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as d3 from 'd3';

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
const displayAsCurrency = (num: number) => new CurrencyPipe('en-US').transform(num, ' ');

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

  constructor(private _router: Router) {}

  public ngOnInit(): void {
    if (this._hasData()) {
      this._setData();
      this._renderBubbleChart();
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

  private _renderBubbleChart(): void {
    const data = {
      children: this.items
    };

    const width = document.body.clientWidth;
    const height = document.body.clientHeight;

    const bubble = d3
      .pack()
      .size([width, height])
      .padding(8);

    // TODO: Add resize watch to resize should user shrink screen
    const svg = d3
      .select('#chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // TODO: Impact items which are negative are ignored, decide how to action
    const root = d3
      .hierarchy(data)
      .sum((d: any) => d.impact)
      .sort((a: any, b: any) => b.impact - a.impact);

    bubble(root);

    const node = svg
      .selectAll('.data-item')
      .data(root.children)
      .enter()
      .append('g')
      .attr('class', (d: any) => `data-item ${this._dataItemClass(d.data)}`)
      .attr('transform', (d: any) => 'translate(' + d.x + ' ' + d.y + ')');

    // Add circle
    node
      .append('circle')
      .attr('r', (d: any) => d.r)
      .attr('class', 'data-item__circle');

    // Add text
    node
      .filter((d: any) => !this._hasImage(d.data) && !this._hasIcon(d.data))
      .append('text')
      .text((d: any) => d.data.name.charAt(0))
      .attr('class', 'data-item__circle__text')
      .attr('dy', '.3em')
      .style('text-anchor', 'middle')
      .style('font-size', (d: any) => `${d.r}px`);

    // Add image instead of text
    node
      .filter((d: any) => this._hasImage(d.data))
      .append('image')
      .attr('class', 'data-item__circle__image')
      .attr('clip-path', (d: any) => `url(${d.data.image})`)
      .attr('xlink:href', (d: any) => d.data.image)
      .attr('x', (d: any) => -d.r * 0.7)
      .attr('y', (d: any) => -d.r * 0.7)
      .attr('height', (d: any) => d.r * 2 * 0.7)
      .attr('width', (d: any) => d.r * 2 * 0.7);

    // Add icon instead of text or image
    node
      .filter((d: any) => this._hasIcon(d.data))
      .append('text')
      .text((d: any) => d.data.icon)
      .attr('class', 'material-icons data-item__circle__icon')
      .attr('dy', '.3em')
      .style('text-anchor', 'middle')
      .style('font-size', (d: any) => `${d.r}px`)
      .attr('y', (d: any) => d.r / 5);

    // Add title
    // TODO: Style title to pretty it up or use d3 tooltip plugin
    node
      .append('title')
      .text(
        (d: any) =>
          `${d.data.name}\n-----------\n+ ${displayAsCurrency(
            d.data.essential ? d.data.expenditure * CONSTANTS.fireMultiplier : 0
          )} FIRE amount\n+ ${displayAsCurrency(d.data.income)} income\n+ ${displayAsCurrency(
            d.data.expenditure
          )} expenditure\n+ ${displayAsCurrency(d.data.liability)} liability\n+ ${displayAsCurrency(
            d.data.assets
          )} assets\n-----------\n${
            this._hasNegativeImpact(d.data.impact) ? '+' : '-'
          } ${this._yearsMonthsDays(d.data.impact)} ${
            this._hasNegativeImpact(d.data.impact) ? 'to' : 'from'
          } your FIRE age`
      );
  }

  private _dataItemClass(item: DataItem): string {
    const classStart = 'data-item--';
    return `${classStart}${
      this._hasNegativeImpact(item.impact) ? 'negative' : 'positive'
    } ${classStart}${this._hasImage(item) ? 'has-image' : ''}`;
  }

  private _hasPositiveImpact(impact: number): boolean {
    return impact < 0;
  }

  private _hasNegativeImpact(impact: number): boolean {
    return impact > 0;
  }

  private _yearsMonthsDays(num: number): string {
    const totalDays = Math.abs(num) * 365;
    const years = Math.floor(totalDays / 365);
    const months = Math.floor((totalDays - years * 365) / 30);
    const days = Math.floor(totalDays - years * 365 - months * 30);
    return `${years} year(s)${months > 0 ? ' ' + months + ' month(s)' : ''}${
      days > 0 ? ' ' + days + ' day(s)' : ''
    }`;
  }

  private _hasImage(item: DataItem): boolean {
    return item.image && item.image.length > 1;
  }

  private _hasIcon(item: DataItem): boolean {
    return item.icon && item.icon.length > 1 && !this._hasImage(item);
  }
}
