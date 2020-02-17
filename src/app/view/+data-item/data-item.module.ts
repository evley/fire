import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { DataItemComponent } from './data-item.component';

@NgModule({
  imports: [CommonModule, MatIconModule],
  declarations: [DataItemComponent],
  exports: [DataItemComponent]
})
export class DataItemModule {}
