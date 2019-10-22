import { TestBed } from '@angular/core/testing';

import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { ColorApplicatorTool } from '../tools/colorApplicatorTool';
import { RectangleTool } from '../tools/rectangleTool';
import { Color } from '../utils/color';
import { MouseEventType, StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { ControllerService } from './controller.service';

describe('ControllerService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});

  });

  it('should be created', () => {
    const service: ControllerService = TestBed.get(ControllerService);
    expect(service).toBeTruthy();
  });

  it('should create new primitives (the rectangle itself and a perimeter) when a left mouse down occurs with a rectangle tool', () => {
    const service: ControllerService = TestBed.get(ControllerService);
    service.tool = new RectangleTool(Color.WHITE, Color.BLACK);
    service.mouseEventOnCanvas(MouseEventType.MouseDownLeft, new Point(0, 0));
    expect(service.primitivesToDraw.length).toBe(2);
  });

  it('should add the rectangle primitive but not the perimeter primitive when a left mouse up occurs with a rectangle tool', () => {
    const service: ControllerService = TestBed.get(ControllerService);
    service.tool = new RectangleTool(Color.WHITE, Color.BLACK);
    service.mouseEventOnCanvas(MouseEventType.MouseDownLeft, new Point(0, 0));
    service.mouseEventOnCanvas(MouseEventType.MouseUpLeft, new Point(10, 10));
    expect(service.primitivesToDraw.length).toBe(1);
  });

  it('should add no primitives to the list while using the color applicator tool', () => {
    const service: ControllerService = TestBed.get(ControllerService);
    service.tool = new RectangleTool(Color.WHITE, Color.BLACK);
    service.mouseEventOnCanvas(MouseEventType.MouseDownLeft, new Point(0, 0));
    service.mouseEventOnCanvas(MouseEventType.MouseUpLeft, new Point(10, 10));
    const rect: SVGPrimitive = service.primitivesToDraw[0];
    service.tool = new ColorApplicatorTool(Color.WHITE, Color.BLACK);
    service.mouseEventOnCanvas(MouseEventType.MouseDownLeft, new Point(0, 0), rect);
    expect(service.primitivesToDraw.length).toBe(1);
  });

  it('#clearSVGElement should correctly clear the lists of primitives', () => {
    const service: ControllerService = TestBed.get(ControllerService);
    service.primitivesToDraw = [new Rectangle(Color.WHITE, Color.BLACK, 1, StrokeType.FullWithOutline, new Point(0, 0))];
    service.clearSVGElements();
    expect(service.primitivesToDraw.length).toBe(0);
  });

  it('#setPrimitives should correctly update the lists of primitives', () => {
    const service: ControllerService = TestBed.get(ControllerService);
    const primitives: SVGPrimitive[] = [new Rectangle(Color.WHITE, Color.BLACK, 1, StrokeType.FullWithOutline, new Point(0, 0))];
    service.setPrimitives(primitives);
    expect(service.primitivesToDraw).toEqual(primitives);
  });

});
