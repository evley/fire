import { Component, Input } from '@angular/core';

import { Financial } from '../+header/financial.interface';
import { BubbleGraphService } from './bubble-graph.service';
import { DataItem } from './data-item.interface';

@Component({
  selector: 'app-bubble-graph',
  templateUrl: './bubble-graph.component.html',
  styleUrls: ['./bubble-graph.component.scss']
})
export class BubbleGraphComponent {
  @Input() public financial: Financial;
  @Input() public set items(items: DataItem[]) {
    if (items && items.length > 0) {
      this._renderBubbleChart(items);
    }
  }

  constructor(private _bubbleGraphService: BubbleGraphService) {}

  private _renderBubbleChart(items: DataItem[]): void {
    const simulation = this._bubbleGraphService.createSimulation();
    const nodes = this._bubbleGraphService.createNodes(items);
    simulation.nodes(nodes).on('tick', () => this._bubbleGraphService.simulationTick(node));
    const node = this._bubbleGraphService.createNode(nodes, simulation);

    // Add to simulation
    this._bubbleGraphService.addCircle(node, simulation);
    // TODO: this._bubbleGraphService.addBadge(node);
    this._bubbleGraphService.addCircleText(node);
    this._bubbleGraphService.addKeySummaryCircle(node, simulation, this.financial);
    this._bubbleGraphService.addCircleImage(node);
    this._bubbleGraphService.addCircleIcon(node);
    this._bubbleGraphService.addCircleTitle(node);
  }
}
