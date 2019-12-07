import { DrawingService } from '../drawing/drawing.service';
import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Color } from '../utils/color';
import { DEFAULT_STROKE_WIDTH, ORIGIN, StrokeType } from '../utils/constantsAndEnums';
import { NewDrawingInfo } from '../utils/newDrawingInfo';
import { Point } from '../utils/point';
import { ClipboardService } from './clipboard.service';
// tslint:disable:no-string-literal
describe('ClipboardService', () => {
  const drawingService: DrawingService = new DrawingService();
  let clipboardService: ClipboardService;
  beforeEach(() => clipboardService = new ClipboardService(drawingService));

  it('should be created', () => {
    expect(clipboardService).toBeTruthy();
    expect(clipboardService.getPrimitives()).not.toBeUndefined();
  });
  it('canvasHeight and canvasWidth should be correctly updated after init', () => {
    const initDimension: number[] = [1920, 1080];
    drawingService.sendInitWorkspaceDimensions(initDimension);
    expect(clipboardService['canvasHeight']).toEqual(1080);
    expect(clipboardService['canvasWidth']).toEqual(1920);
  });
  it('canvasHeight and canvasWidth should be correcly updated after the input of new dimensions' , () => {
    const newDimensions: NewDrawingInfo = new NewDrawingInfo(502, 214, Color.BLACK);
    drawingService.sendDrawingData(newDimensions);
    expect(clipboardService['canvasHeight']).toEqual(214);
    expect(clipboardService['canvasWidth']).toEqual(502);
  });
  it('paste offset value should get back to ORIGIN when it exceeds the limit of the dimensions', () => {
    const newDimensions: NewDrawingInfo = new NewDrawingInfo(100, 100, Color.BLACK);
    drawingService.sendDrawingData(newDimensions);
    const primitive: SVGPrimitive[] = [new Rectangle(Color.BLACK, Color.WHITE, DEFAULT_STROKE_WIDTH, StrokeType.FullWithOutline,
      new Point(0, 0), 20, 20)];
    clipboardService.setPrimitives(primitive);
    clipboardService.incrementPasteOffset();
    expect(clipboardService['pasteOffset']).toEqual(new Point(50, 50));
    clipboardService.incrementPasteOffset();
    expect(clipboardService['pasteOffset']).toEqual(ORIGIN);
  });
  it('Duplicate offset value should get back to ORIGIN when it exceeds the limit of the dimensions', () => {
    const newDimensions: NewDrawingInfo = new NewDrawingInfo(100, 100, Color.BLACK);
    drawingService.sendDrawingData(newDimensions);
    const primitive: SVGPrimitive[] = [new Rectangle(Color.BLACK, Color.WHITE, DEFAULT_STROKE_WIDTH, StrokeType.FullWithOutline,
      new Point(0, 0), 20, 20)];
    clipboardService.incrementDuplicateOffset(primitive);
    expect(clipboardService['duplicateOffset']).toEqual(new Point(50, 50));
    clipboardService.incrementDuplicateOffset(primitive);
    expect(clipboardService['duplicateOffset']).toEqual(ORIGIN);
  });
});
