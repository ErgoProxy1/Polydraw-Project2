import { TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { CanvasControllerService } from '../canvasController/canvas-controller.service';
import { DrawingService } from '../drawing/drawing.service';
import { ToolType } from '../utils/constantsAndEnums';
import { ColorApplicatorTool } from './colorApplicatorTool';
import { PaintBrushTool } from './paintBrushTool';
import { PencilTool } from './pencilTool';
import { RectangleTool } from './rectangleTool';
import { ToolsService } from './tools.service';

describe('ToolsService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    providers: [CanvasControllerService, DrawingService],
    imports: [HttpClientModule],
  }));

  it('should be created', () => {
    const service: ToolsService = TestBed.get(ToolsService);
    expect(service).toBeTruthy();
  });

  it('Selected tool type is correctly detected', () => {
    const service: ToolsService = TestBed.get(ToolsService);
    const controller: CanvasControllerService = TestBed.get(CanvasControllerService);
    let toolType: ToolType = ToolType.RectangleTool;

    service.newToolSelected(toolType);
    expect(controller.tool).toEqual(jasmine.any(RectangleTool));

    toolType = ToolType.PaintBrushTool;
    service.newToolSelected(toolType);
    expect(controller.tool).toEqual(jasmine.any(PaintBrushTool));

    toolType = ToolType.Pencil;
    service.newToolSelected(toolType);
    expect(controller.tool).toEqual(jasmine.any(PencilTool));

    toolType = ToolType.ColorApplicator;
    service.newToolSelected(toolType);
    expect(controller.tool).toEqual(jasmine.any(ColorApplicatorTool));

    toolType = ToolType.None;
    service.newToolSelected(toolType);
    expect(controller.tool).toBeUndefined();
  });
});
