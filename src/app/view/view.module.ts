import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BubbleGraphModule } from './+bubble-graph/bubble-graph.module';
import { ViewRoutingModule } from './view-routing';
import { ViewComponent } from './view.component';

@NgModule({
  imports: [CommonModule, BubbleGraphModule, ViewRoutingModule],
  declarations: [ViewComponent],
  providers: []
})
export class ViewModule {}
