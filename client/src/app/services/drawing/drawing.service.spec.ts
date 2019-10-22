import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NTimesPipe } from 'src/app/pipes/n-times.pipe';
import { CanvasComponent } from '../../components/canvas/canvas.component';
import { NewDrawingComponent } from '../../components/horizontal-menu/new-drawing/new-drawing.component';
import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Color } from '../utils/color';
import { StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { DrawingService } from './drawing.service';

describe('DrawingService', () => {
  let newDrawing: NewDrawingComponent;
  let drawingFixture: ComponentFixture<NewDrawingComponent>;
  let canvas: CanvasComponent;
  let canvasFixture: ComponentFixture<CanvasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewDrawingComponent, CanvasComponent, NTimesPipe],
      imports: [FormsModule, ReactiveFormsModule]})
    .compileComponents();

    drawingFixture = TestBed.createComponent(NewDrawingComponent);
    newDrawing = drawingFixture.componentInstance;
    drawingFixture.detectChanges();

    canvasFixture = TestBed.createComponent(CanvasComponent);
    canvas = canvasFixture.componentInstance;
    canvasFixture.detectChanges();
  });

  it('should be created', () => {
    const service: DrawingService = TestBed.get(DrawingService);
    expect(service).toBeTruthy();
  });

  it('New Drawing data is correctly sent', () => {
    newDrawing.workspaceDimensions = [128, 64];
    newDrawing.resetForm();
    newDrawing.newDrawing(newDrawing.drawingForm);
    expect(canvas.canvasWidth).toEqual(newDrawing.drawingForm.value.width);
    expect(canvas.canvasHeight).toEqual(newDrawing.drawingForm.value.height);
  });

  it('New Drawing properly detects if primitives are present', () => {
    let primitives: SVGPrimitive[] = [];
    newDrawing.checkPrimitivesLength(primitives);
    expect(newDrawing.primitivesPresent).toBe(false);
    primitives = [new Rectangle(new Color(255, 255, 255, 1), new Color(255, 255, 255, 1),
    5, StrokeType.Full, new Point(0, 0), 100, 100)];
    newDrawing.checkPrimitivesLength(primitives);
    expect(newDrawing.primitivesPresent).toBe(true);
  });
});
