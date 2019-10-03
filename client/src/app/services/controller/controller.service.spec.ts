import { TestBed } from '@angular/core/testing';

import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { ColorApplicatorTool } from '../tools/colorApplicatorTool';
import { RectangleTool } from '../tools/rectangleTool';
import { Color } from '../utils/color';
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

  it('should create new primitives (the rectangle itself and a perimeter) when a mouse down occurs with a rectangle tool', () => {
    const service: ControllerService = TestBed.get(ControllerService);
    service.tool = new RectangleTool(Color.WHITE, Color.BLACK);
    service.mouseDownOnCanvas(new Point(0, 0));
    expect(service.getPrimitivesToPaint().length).toBe(2);
  });

  it('should add the rectangle primitive but not the perimeter primitive when a mouse up occurs with a rectangle tool', () => {
    const service: ControllerService = TestBed.get(ControllerService);
    service.tool = new RectangleTool(Color.WHITE, Color.BLACK);
    service.mouseDownOnCanvas(new Point(0, 0));
    service.mouseUpOnCanvas(new Point(10, 10));
    expect(service.getPrimitivesToPaint().length).toBe(1);
  });

  it('should add no primitives to the list while using the color applicator tool', () => {
    const service: ControllerService = TestBed.get(ControllerService);
    service.tool = new RectangleTool(Color.WHITE, Color.BLACK);
    service.mouseDownOnCanvas(new Point(0, 0));
    service.mouseUpOnCanvas(new Point(10, 10));
    const rect: SVGPrimitive = service.getPrimitivesToPaint()[0];
    service.tool = new ColorApplicatorTool(Color.WHITE, Color.BLACK);
    service.selectPrimitive(true, rect);
    expect(service.getPrimitivesToPaint().length).toBe(1);
  });

});
