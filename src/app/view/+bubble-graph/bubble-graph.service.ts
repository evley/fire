import { CurrencyPipe } from '@angular/common';
import { Injectable } from '@angular/core';

import * as d3 from 'd3';
import { CONSTANTS } from 'src/app/app.constant';

import { Financial } from '../financial.interface';
import { BubbleGraphSettings } from './bubble-graph-settings.interface';
import { DataItemNode } from './data-item-node.interface';
import { DataItem } from './data-item.interface';

const negativeFinancialList = [CONSTANTS.financial.liability, CONSTANTS.financial.expenditure];
const width = document.body.clientWidth;
const height = document.body.clientHeight;
const settings: BubbleGraphSettings = {
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

@Injectable({
  providedIn: 'root'
})
export class BubbleGraphService {
  public createSimulation(): d3.Simulation<d3.SimulationNodeDatum, any> {
    return d3
      .forceSimulation()
      .force('charge', d3.forceManyBody())
      .force('collide', this._forceCollide)
      .force('center', d3.forceCenter(settings.centreX, settings.centreY))
      .force('x', d3.forceX(settings.centreX).strength(settings.strength))
      .force('y', d3.forceY(settings.centreY).strength(settings.strength));
  }

  public createNodes(items: DataItem[]): DataItemNode[] {
    return this._createBubble()(this._createHierarchy(items))
      .leaves()
      .map(
        (item) =>
          ({
            ...item,
            x: settings.centreX + (item.x - settings.centreX) * 10,
            y: settings.centreY + (item.y - settings.centreY) * 10,
            r: 0,
            radius: item.r
          } as DataItemNode)
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
    node
      .attr(
        'transform',
        (d) =>
          `translate(${Math.max(d.r, Math.min(settings.width - d.r, d.x))},${Math.max(
            d.r,
            Math.min(settings.height - d.r, d.y)
          )})`
      )
      .select('circle')
      .attr('r', (d) => d.r);
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
      .duration(settings.transitionSpeed)
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
      .style('font-size', (d) => `${d.radius}px`);
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
      .duration(settings.transitionSpeed * 2)
      .ease(d3.easePolyOut)
      .tween('circleIn', (d) => (t) => {
        d.fx = d3.interpolateNumber(d.x, settings.centreX)(t);
        d.fy = d3.interpolateNumber(d.y, settings.centreY)(t);
        d.r = d3.interpolateNumber(d.r, settings.centreY * 0.5)(t);
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
      .attr('x', (d) => -d.radius * 0.7)
      .attr('y', (d) => -d.radius * 0.7)
      .attr('height', (d) => d.radius * 2 * 0.7)
      .attr('width', (d) => d.radius * 2 * 0.7);
  }

  public addCircleIcon(node: d3.Selection<SVGGElement, DataItemNode, SVGSVGElement, any>): void {
    node
      .filter((d) => this._hasIcon(d.data))
      .append('text')
      .text((d) => d.data.icon)
      .attr('class', 'material-icons data-item__circle__icon')
      .attr('dy', '.3em')
      .style('text-anchor', 'middle')
      .style('font-size', (d) => `${d.radius}px`)
      .attr('y', (d) => d.radius / 5);
  }

  public addCircleTitle(node: d3.Selection<SVGGElement, DataItemNode, SVGSVGElement, any>): void {
    // TODO: Style title to pretty it up or use d3 tooltip plugin
    node
      .filter((d) => !this._isKey(d.data))
      .append('title')
      .text(
        (d) =>
          `${d.data.name}\n-----------\n${
            this._isEssential(d.data) ? '✔ Essential\n' : ''
          }+ ${this._displayAsCurrency(
            d.data.essential ? d.data.expenditure * CONSTANTS.fireMultiplier : 0
          )} FIRE Fund Required\n+ ${this._displayAsCurrency(
            d.data.income
          )} Income\n+ ${this._displayAsCurrency(
            d.data.expenditure
          )} Expenditure\n+ ${this._displayAsCurrency(
            d.data.liability
          )} Liability\n+ ${this._displayAsCurrency(d.data.assets)} Assets\n-----------\n${
            this._hasNegativeImpact(d.data.impact) ? '+' : '-'
          } ${this._yearsMonthsDays(d.data.impact)} ${
            this._hasNegativeImpact(d.data.impact) ? 'to' : 'from'
          } FIRE time`
      );
  }

  private _createSvg(): d3.Selection<SVGSVGElement, any, HTMLElement, any> {
    return d3
      .select(`#${settings.chartId}`)
      .append('svg')
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('viewBox', `0 0 ${settings.width} ${settings.height}`)
      .attr('class', 'chart__svg');
  }

  private get _forceCollide(): d3.ForceCollide<DataItemNode> {
    return d3.forceCollide((d: DataItemNode) => d.r + settings.padding);
  }

  private _createBubble(): d3.PackLayout<any> {
    return d3
      .pack()
      .size([settings.width, settings.height])
      .padding(settings.padding);
  }

  private _createHierarchy(
    items: DataItem[]
  ): d3.HierarchyNode<{
    children: DataItem[];
  }> {
    // TODO: Impact items which are negative are ignored, decide how to action
    return d3
      .hierarchy({ children: items })
      .sum((d) => d[settings.weightingProp])
      .sort((a, b) => b[settings.weightingProp] - a[settings.weightingProp]);
  }

  private _dataItemClass(item: DataItem): string {
    const classStart = 'data-item--';
    return `${classStart}${this._hasNegativeImpact(item.impact) ? 'negative' : 'positive'} ${
      this._hasImage(item) ? `${classStart}has-image` : ''
    } ${this._isKey(item) ? `${classStart}key` : ''} ${
      this._isEssential(item) ? `${classStart}essential` : ''
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
    return `${years} year${isPlural(years)}${
      months > 0 ? ' ' + months + ' month' + isPlural(months) : ''
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
    return `data-item__summary__finance-item__value--${
      this._isInNegativeList(key) ? 'negative' : 'positive'
    }`;
  }

  private _displayAsCurrency(num: number) {
    return new CurrencyPipe('en-US').transform(num, ' ');
  }
}
