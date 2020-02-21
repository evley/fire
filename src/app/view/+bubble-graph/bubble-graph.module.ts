import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BubbleGraphComponent } from './bubble-graph.component';
import { BubbleGraphService } from './bubble-graph.service';

@NgModule({
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  declarations: [BubbleGraphComponent],
  exports: [BubbleGraphComponent],
  providers: [BubbleGraphService]
})
export class BubbleGraphModule {}
