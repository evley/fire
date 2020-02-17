import { Component, Input } from '@angular/core';

import { DataItem } from './data-item.interface';

@Component({
  selector: 'app-data-item',
  templateUrl: './data-item.component.html',
  styleUrls: ['./data-item.component.scss']
})
export class DataItemComponent {
  @Input() public item: DataItem;

  public showInfluence(item: DataItem): void {
    // TODO:
  }

  public hideInfluence(): void {
    // TODO:
  }

  public get hasItem(): boolean {
    return Boolean(this.item);
  }

  public get hasPositiveImpact(): boolean {
    return this.item.impact <= 0;
  }

  public get hasNegativeImpact(): boolean {
    return this.item.impact > 0;
  }

  public get title(): string {
    return `${this.item.name} (${this.item.impact})`;
  }

  public get hasImage(): boolean {
    return this.item.image && this.item.image.length > 1;
  }

  public get hasIcon(): boolean {
    return this.item.icon && this.item.icon.length > 1 && !this.hasImage;
  }
}
