import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { SVGPrimitive } from 'src/app/services/svgPrimitives/svgPrimitive';
import { PrimitiveType, Texture } from 'src/app/services/utils/constantsAndEnums';
import { DefaultStamps, StampInfo } from 'src/app/services/utils/stampData';

@Component({
  selector: 'g[app-svg]',
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.scss'],
})
export class SvgComponent {

  @Input() primitives: SVGPrimitive[];

  @Output() mouseDown: EventEmitter<any> = new EventEmitter();
  @Output() mouseMove: EventEmitter<any> = new EventEmitter();
  @Output() mouseUp: EventEmitter<any> = new EventEmitter();
  @Output() click: EventEmitter<any> = new EventEmitter();

  @ViewChild('svg', { static: false }) htmlOfPrimitives: ElementRef;

  PrimitiveType = PrimitiveType;
  Texture = Texture;

  readonly FILTER_IDS: string[] = ['basic', 'degraded', 'grayed', 'light', 'frothy'];
  readonly STAMPS: StampInfo[] = DefaultStamps;
  readonly PATTERN_TYPE: string[] = ['3', '', '4 2 3', '2 1', '5 1 2', '3 0.5 0.5 0.5'];
  readonly LINE_JOIN_TYPE: string[] = ['arcs', 'bevel', 'miter', 'miter-clip', 'Point', 'Round'];
  readonly LINE_CAP_TYPE: string[] = ['butt', 'round', 'square'];

  mouseDownOnCanvas(event: PointerEvent, primitive?: SVGPrimitive): void {
    this.mouseDown.emit([event, primitive]);
  }

  mouseMoveOnCanvas(event: PointerEvent, primitive?: SVGPrimitive): void {
    this.mouseMove.emit([event, primitive]);
  }

  mouseUpOnCanvas(event: PointerEvent, primitive?: SVGPrimitive): void {
    this.mouseUp.emit([event, primitive]);
  }

  clickOnCanvas(event: MouseEvent, primitive?: SVGPrimitive): void {
    this.click.emit([event, primitive]);
  }

}
