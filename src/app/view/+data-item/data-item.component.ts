import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

import { CONSTANTS } from 'src/app/app.constant';

import { DataItem } from './data-item.interface';

const displayAsCurrency = (num: number) => new CurrencyPipe('en-US').transform(num, ' ');

@Component({
  selector: 'app-data-item',
  templateUrl: './data-item.component.html',
  styleUrls: ['./data-item.component.scss']
})
export class DataItemComponent {
  @Input() public item: DataItem;

  public get hasItem(): boolean {
    return Boolean(this.item);
  }

  public get hasPositiveImpact(): boolean {
    return this.item.impact < 0;
  }

  public get hasNegativeImpact(): boolean {
    return this.item.impact > 0;
  }

  public get title(): string {
    return `${this.item.name}\n-----------\n+ ${displayAsCurrency(
      this.item.essential ? this.item.expenditure * CONSTANTS.fireMultiplier : 0
    )} FIRE amount\n+ ${displayAsCurrency(this.item.income)} income\n+ ${displayAsCurrency(
      this.item.expenditure
    )} expenditure\n+ ${displayAsCurrency(this.item.liability)} liability\n+ ${displayAsCurrency(
      this.item.assets
    )} assets\n-----------\n${this.hasNegativeImpact ? '+' : '-'} ${this._yearsMonthsDays(
      this.item.impact
    )} ${this.hasNegativeImpact ? 'to' : 'from'} your FIRE age`;
  }

  public get hasImage(): boolean {
    return this.item.image && this.item.image.length > 1;
  }

  public get hasIcon(): boolean {
    return this.item.icon && this.item.icon.length > 1 && !this.hasImage;
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
}
