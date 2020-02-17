import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DataItemModule } from './+data-item/data-item.module';
import { HeaderModule } from './+header/header.module';
import { ViewRoutingModule } from './view-routing';
import { ViewComponent } from './view.component';

@NgModule({
  imports: [CommonModule, DataItemModule, HeaderModule, ViewRoutingModule],
  declarations: [ViewComponent],
  providers: []
})
export class ViewModule {}
