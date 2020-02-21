import { DataItem } from './data-item.interface';

export interface DataItemNode extends d3.SimulationNodeDatum {
  data: DataItem;
  radius: number;
  r: number;
  x: number;
  y: number;
}
