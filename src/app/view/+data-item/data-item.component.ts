import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DataItemInfluenceEvent } from './data-item-influence-event.interface';
import { DataItem } from './data-item.interface';

@Component({
  selector: 'app-data-item',
  templateUrl: './data-item.component.html',
  styleUrls: ['./data-item.component.scss']
})
export class DataItemComponent {
  @Input() public item: DataItem;
  @Output() public onInfluence: EventEmitter<DataItemInfluenceEvent> = new EventEmitter();

  public showInfluence(show: boolean): void {
    this.onInfluence.emit({ item: this.item, show });
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
