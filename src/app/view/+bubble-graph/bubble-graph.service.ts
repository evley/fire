import { CurrencyPipe } from '@angular/common';
import { Injectable } from '@angular/core';

import * as d3 from 'd3';
import { CONSTANTS } from 'src/app/app.constant';

import { Financial } from '../financial.interface';
import { BubbleGraphSettings } from './bubble-graph-settings.interface';
import { DataItemNode } from './data-item-node.interface';
import { DataItem } from './data-item.interface';

const negativeFinancialList = [CONSTANTS.financial.liability, CONSTANTS.financial.expenditure];

function getSettings(): BubbleGraphSettings {
  const width = document.body.clientWidth || window.innerWidth;
  const height = document.body.clientHeight || window.innerHeight;
  return {
    chartId: 'chart',
    weightingProp: 'value',
    width,
    height,
    centreX: width * 0.5,
    centreY: height * 0.5,
    strength: 0.05,
    padding: 6,
    transitionSpeed: 800
  };
}

// Helper to ensure a value is a valid number, defaulting to fallback if NaN/undefined
function safeNumber(value: number, fallback: number = 0): number {
  return (typeof value === 'number' && isFinite(value)) ? value : fallback;
}

@Injectable({
  providedIn: 'root'
})
export class BubbleGraphService {
  public createSimulation(): d3.Simulation<d3.SimulationNodeDatum, any> {
    return d3
      .forceSimulation()
      .force('charge', d3.forceManyBody())
      .force('collide', this._forceCollide)
      .force('x', d3.forceX(getSettings().centreX).strength(getSettings().strength))
      .force('y', d3.forceY(getSettings().centreY).strength(getSettings().strength));
  }

  public createNodes(items: DataItem[]): DataItemNode[] {
    const settings = getSettings();
    return this._createBubble()(this._createHierarchy(items))
      .leaves()
      .map(
        (item) => {
          const centreX = settings.centreX;
          const centreY = settings.centreY;
          const itemX = safeNumber(item.x, centreX);
          const itemY = safeNumber(item.y, centreY);
          const itemR = safeNumber(item.r, 20); // Default radius of 20 if NaN
          return {
            ...item,
            x: centreX + (itemX - centreX) * 3,
            y: centreY + (itemY - centreY) * 3,
            r: 0,
            radius: itemR
          } as DataItemNode;
        }
      );
  }

  public createNode(
    nodes: DataItemNode[],
    simulation: d3.Simulation<d3.SimulationNodeDatum, any>
  ): any {
    return this._createSvg()
      .selectAll('.data-item')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', (d) => `data-item ${this._dataItemClass(d.data)}`)
      .call(
        d3
          .drag()
          .on('start', (d: DataItemNode) => {
            if (!d3.event.active) {
              simulation.alphaTarget(0.2).restart();
            }
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (d: DataItemNode) => {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
          })
          .on('end', (d: DataItemNode) => {
            if (!d3.event.active) {
              simulation.alphaTarget(0);
            }
            d.fx = null;
            d.fy = null;
          })
      );
  }

  public simulationTick(node: d3.Selection<SVGGElement, DataItemNode, SVGSVGElement, any>): void {
    const settings = getSettings();
    node
      .attr(
        'transform',
        (d) => {
          const r = safeNumber(d.r, 0);
          const x = safeNumber(d.x, settings.centreX);
          const y = safeNumber(d.y, settings.centreY);
          return `translate(${Math.max(r, Math.min(settings.width - r, x))},${Math.max(
            r,
            Math.min(settings.height - r, y)
          )})`;
        }
      )
      .select('circle')
      .attr('r', (d) => safeNumber(d.r, 0));
  }

  public addCircle(
    node: d3.Selection<SVGGElement, DataItemNode, SVGSVGElement, any>,
    simulation: d3.Simulation<d3.SimulationNodeDatum, any>
  ): void {
    node
      .append('circle')
      .attr('r', 0)
      .attr('class', 'data-item__circle')
      .transition()
      .duration(getSettings().transitionSpeed)
      .ease(d3.easeElasticOut)
      .tween('circleIn', (d) => (t) => {
        d.r = d3.interpolateNumber(0, d.radius)(t);
        simulation.force('collide', this._forceCollide);
      });
  }

  public addCircleText(node: d3.Selection<SVGGElement, DataItemNode, SVGSVGElement, any>): void {
    node
      .filter((d) => !this._hasImage(d.data) && !this._hasIcon(d.data) && !this._isKey(d.data))
      .append('text')
      .text((d) => d.data.name.charAt(0))
      .attr('class', 'data-item__text')
      .attr('dy', '.3em')
      .style('text-anchor', 'middle')
      .style('font-size', (d) => `${safeNumber(d.radius, 20)}px`);
  }

  public addKeySummaryCircle(
    node: d3.Selection<SVGGElement, DataItemNode, SVGSVGElement, any>,
    simulation: d3.Simulation<d3.SimulationNodeDatum, any>,
    financial: Financial
  ): void {
    node
      .filter((d) => this._isKey(d.data))
      .append('foreignObject')
      .attr('x', -350 * 0.5)
      .attr('y', -350 * 0.5)
      .attr('height', 350)
      .attr('width', 350)
      .html(
        (d) => `
          <h1 class="data-item__summary__title">
            ${this._yearsMonthsDays(financial.fireTime.value)} away from <strong>FIRE</strong>
          </h1>
          ${this._getOrderedFinancialKeys(financial).reduce(
          (listStr, key) =>
          (listStr +=
            '<p class="data-item__summary__finance-item">' +
            '<span class="data-item__summary__finance-item__name">' +
            financial[key].name +
            ':' +
            '</span> ' +
            '<span class="data-item__summary__finance-item__value ' +
            this._summaryFinanceItemClass(key) +
            '">' +
            this._displayAsCurrency(financial[key].value) +
            '</span>' +
            '</p>'),
          ''
        )}
        `
      )
      .attr('class', 'data-item__summary')
      .transition()
      .duration(getSettings().transitionSpeed * 2)
      .ease(d3.easeElasticOut)
      .tween('circleIn', (d) => (t) => {
        d.r = d3.interpolateNumber(0, d.radius)(t);
        simulation.force('collide', this._forceCollide);
        d.fx = d3.interpolateNumber(d.x, getSettings().centreX)(t);
        d.fy = d3.interpolateNumber(d.y, getSettings().centreY)(t);
        d.r = d3.interpolateNumber(d.r, getSettings().centreY * 0.5)(t);
        simulation.force('collide', this._forceCollide);
      });
  }

  public addCircleImage(node: d3.Selection<SVGGElement, DataItemNode, SVGSVGElement, any>): void {
    node
      .filter((d) => this._hasImage(d.data))
      .append('image')
      .attr('class', 'data-item__circle__image')
      .attr('clip-path', (d) => `url(${d.data.image})`)
      .attr('xlink:href', (d) => d.data.image)
      .attr('x', (d) => -safeNumber(d.radius, 20) * 0.7)
      .attr('y', (d) => -safeNumber(d.radius, 20) * 0.7)
      .attr('height', (d) => safeNumber(d.radius, 20) * 2 * 0.7)
      .attr('width', (d) => safeNumber(d.radius, 20) * 2 * 0.7);
  }

  public addCircleIcon(node: d3.Selection<SVGGElement, DataItemNode, SVGSVGElement, any>): void {
    node
      .filter((d) => this._hasIcon(d.data))
      .append('text')
      .text((d) => d.data.icon)
      .attr('class', 'material-icons data-item__circle__icon')
      .attr('dy', '.3em')
      .style('text-anchor', 'middle')
      .style('font-size', (d) => `${safeNumber(d.radius, 20)}px`)
      .attr('y', (d) => safeNumber(d.radius, 20) / 5);
  }

  public addCircleTitle(node: d3.Selection<SVGGElement, DataItemNode, SVGSVGElement, any>): void {
    // TODO: Style title to pretty it up or use d3 tooltip plugin
    node
      .filter((d) => !this._isKey(d.data))
      .append('title')
      .text(
        (d) =>
          `${d.data.name}\n-----------\n${this._isEssential(d.data) ? '✔ Essential\n' : ''
          }+ ${this._displayAsCurrency(
            d.data.essential ? d.data.expenditure * CONSTANTS.fireMultiplier : 0
          )} FIRE Fund Required\n+ ${this._displayAsCurrency(
            d.data.income
          )} Income\n+ ${this._displayAsCurrency(
            d.data.expenditure
          )} Expenditure\n+ ${this._displayAsCurrency(
            d.data.liability
          )} Liability\n+ ${this._displayAsCurrency(d.data.assets)} Assets\n-----------\n${this._hasNegativeImpact(d.data.impact) ? '+' : '-'
          } ${this._yearsMonthsDays(d.data.impact)} ${this._hasNegativeImpact(d.data.impact) ? 'to' : 'from'
          } FIRE time`
      );
  }

  private _createSvg(): d3.Selection<SVGSVGElement, any, HTMLElement, any> {
    return d3
      .select(`#${getSettings().chartId}`)
      .append('svg')
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('viewBox', `0 0 ${getSettings().width} ${getSettings().height}`)
      .attr('class', 'chart__svg');
  }

  private get _forceCollide(): d3.ForceCollide<DataItemNode> {
    return d3.forceCollide((d: DataItemNode) => d.r + getSettings().padding);
  }

  private _createBubble(): d3.PackLayout<any> {
    return d3
      .pack()
      .size([getSettings().width, getSettings().height])
      .padding(getSettings().padding);
  }

  private _createHierarchy(
    items: DataItem[]
  ): d3.HierarchyNode<{
    children: DataItem[];
  }> {
    return d3
      .hierarchy({ children: items })
      .sum((d) => d[getSettings().weightingProp])
      .sort((a, b) => b[getSettings().weightingProp] - a[getSettings().weightingProp]);
  }

  private _dataItemClass(item: DataItem): string {
    const classStart = 'data-item--';
    return `${classStart}${this._hasNegativeImpact(item.impact) ? 'negative' : 'positive'} ${this._hasImage(item) ? `${classStart}has-image` : ''
      } ${this._isKey(item) ? `${classStart}key` : ''} ${this._isEssential(item) ? `${classStart}essential` : ''
      }`;
  }

  private _isEssential(item: DataItem): boolean {
    return item.essential;
  }

  private _hasNegativeImpact(impact: number): boolean {
    return impact > 0;
  }

  private _yearsMonthsDays(num: number): string {
    const isPlural = (check: number): string => (check === 0 || check > 1 ? 's' : '');
    const totalDays = Math.abs(num) * 365;
    const years = Math.floor(totalDays / 365);
    const months = Math.floor((totalDays - years * 365) / 30);
    const days = Math.floor(totalDays - years * 365 - months * 30);
    return `${years} year${isPlural(years)}${months > 0 ? ' ' + months + ' month' + isPlural(months) : ''
      }${days > 0 ? ' and ' + days + ' day' + isPlural(days) : ''}`;
  }

  private _hasImage(item: DataItem): boolean {
    return item.image && item.image.length > 1;
  }

  private _hasIcon(item: DataItem): boolean {
    return item.icon && item.icon.length > 1 && !this._hasImage(item);
  }

  private _isKey(item: DataItem): boolean {
    return item.key;
  }

  private _getOrderedFinancialKeys(financial: Financial): string[] {
    const { income, expenditure, profit, assets, liability, fireReq } = financial;
    return Object.keys({ income, expenditure, profit, assets, liability, fireReq });
  }

  private _isInNegativeList(name: string): boolean {
    return negativeFinancialList.indexOf(name.toLowerCase()) > -1;
  }

  private _summaryFinanceItemClass(key: string): string {
    return `data-item__summary__finance-item__value--${this._isInNegativeList(key) ? 'negative' : 'positive'
      }`;
  }

  private _displayAsCurrency(num: number) {
    return new CurrencyPipe('en-US').transform(num, ' ');
  }
}
