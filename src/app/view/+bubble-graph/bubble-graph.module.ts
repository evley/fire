import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BubbleGraphComponent } from './bubble-graph.component';
import { BubbleGraphService } from './bubble-graph.service';

@NgModule({
  imports: [CommonModule],
  declarations: [BubbleGraphComponent],
  exports: [BubbleGraphComponent],
  providers: [BubbleGraphService]
})
export class BubbleGraphModule {}
