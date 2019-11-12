import { async, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { ShapeToolCommand } from '../toolCommands/shapeToolCommand';
import { ToolCommand } from '../toolCommands/toolCommand';
import { ColorApplicatorTool } from '../tools/colorApplicatorTool';
import { RectangleTool } from '../tools/rectangleTool';
import { Tool } from '../tools/tool';
import { ToolsService } from '../tools/tools.service';
import { Color } from '../utils/color';
import { MouseEventType, StrokeType, ToolType } from '../utils/constantsAndEnums';
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

  it('should create new primitives (the rectangle itself and a perimeter) when a left mouse down occurs with a rectangle tool',
   async(() => {
    const service: ControllerService = TestBed.get(ControllerService);
    const toolsService: ToolsService = TestBed.get(ToolsService);
    const tool: Tool = new RectangleTool(Color.WHITE, Color.BLACK);
    toolsService.tools.set(ToolType.RectangleTool, tool);
    toolsService.newToolSelected(ToolType.RectangleTool);
    spyOn(toolsService, 'subscribeToToolChanged').and.returnValue(of(tool));
    service.mouseEventOnCanvas(MouseEventType.MouseDownLeft, new Point(0, 0));
    const command: ToolCommand = new ShapeToolCommand(
      new Rectangle(Color.WHITE, Color.BLACK, 10, StrokeType.FullWithOutline, new Point(0, 0)));
    spyOn(tool, 'subscribeToCommand').and.returnValue(of(command));
    expect(service.primitivesToDraw.length).toBe(2);
  }));

  it('should add the rectangle primitive but not the perimeter primitive when a left mouse up occurs with a rectangle tool',
   async(() => {
    const service: ControllerService = TestBed.get(ControllerService);
    const toolsService: ToolsService = TestBed.get(ToolsService);
    const tool: Tool = new RectangleTool(Color.WHITE, Color.BLACK);
    toolsService.tools.set(ToolType.RectangleTool, tool);
    toolsService.newToolSelected(ToolType.RectangleTool);
    spyOn(toolsService, 'subscribeToToolChanged').and.returnValue(of(tool));
    service.mouseEventOnCanvas(MouseEventType.MouseDownLeft, new Point(0, 0));
    service.mouseEventOnCanvas(MouseEventType.MouseUpLeft, new Point(10, 10));
    const command: ToolCommand = new ShapeToolCommand(
      new Rectangle(Color.WHITE, Color.BLACK, 10, StrokeType.FullWithOutline, new Point(0, 0)));
    spyOn(tool, 'subscribeToCommand').and.returnValue(of(command));
    expect(service.primitivesToDraw.length).toBe(1);
  }));

  it('should add no primitives to the list while using the color applicator tool', async(() => {
    const service: ControllerService = TestBed.get(ControllerService);
    const toolsService: ToolsService = TestBed.get(ToolsService);
    const tool: Tool = new RectangleTool(Color.WHITE, Color.BLACK);
    toolsService.tools.set(ToolType.RectangleTool, new RectangleTool(Color.WHITE, Color.BLACK));
    toolsService.tools.set(ToolType.ColorApplicator, new ColorApplicatorTool(Color.WHITE, Color.BLACK));
    toolsService.newToolSelected(ToolType.RectangleTool);
    spyOn(toolsService, 'subscribeToToolChanged').and.returnValue(of(tool));
    service.mouseEventOnCanvas(MouseEventType.MouseDownLeft, new Point(0, 0));
    service.mouseEventOnCanvas(MouseEventType.MouseUpLeft, new Point(10, 10));
    const command: ToolCommand = new ShapeToolCommand(
      new Rectangle(Color.WHITE, Color.BLACK, 10, StrokeType.FullWithOutline, new Point(0, 0)));
    spyOn(tool, 'subscribeToCommand').and.returnValue(of(command));
    const rect: SVGPrimitive = service.primitivesToDraw[0];
    toolsService.newToolSelected(ToolType.ColorApplicator);
    service.mouseEventOnCanvas(MouseEventType.MouseDownLeft, new Point(0, 0), rect);
    expect(service.primitivesToDraw.length).toBe(1);
  }));

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
