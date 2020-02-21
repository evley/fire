import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BubbleGraphModule } from './+bubble-graph/bubble-graph.module';
import { HeaderModule } from './+header/header.module';
import { ViewRoutingModule } from './view-routing';
import { ViewComponent } from './view.component';

@NgModule({
  imports: [CommonModule, BubbleGraphModule, HeaderModule, ViewRoutingModule],
  declarations: [ViewComponent],
  providers: []
})
export class ViewModule {}
