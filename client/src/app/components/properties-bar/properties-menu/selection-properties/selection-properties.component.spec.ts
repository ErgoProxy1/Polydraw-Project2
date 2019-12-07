// tslint:disable
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CanvasControllerService } from 'src/app/services/canvasController/canvas-controller.service';
import { Path } from 'src/app/services/svgPrimitives/path/path';
import { Rectangle } from 'src/app/services/svgPrimitives/rectangle/rectangle';
import { SVGPrimitive } from 'src/app/services/svgPrimitives/svgPrimitive';
import { SelectorTool } from 'src/app/services/tools/selectorTool';
import { ToolsService } from 'src/app/services/tools/tools.service';
import { Color } from 'src/app/services/utils/color';
import { DEFAULT_STROKE_WIDTH, GridAlignment, MAX_ROTATION_ANGLE, MIN_ROTATION_ANGLE, MouseEventType,
  StrokeType, ToolType } from 'src/app/services/utils/constantsAndEnums';
import { Point } from 'src/app/services/utils/point';
import { SelectionPropertiesComponent } from './selection-properties.component';
import { RotationService } from 'src/app/services/rotation/rotation.service';

describe('SelectionPropertiesComponent', () => {
  let component: SelectionPropertiesComponent;
  let fixture: ComponentFixture<SelectionPropertiesComponent>;
  let controllerService: CanvasControllerService;
  let toolService: ToolsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionPropertiesComponent ],
      imports: [FormsModule, HttpClientModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    controllerService = TestBed.get(CanvasControllerService);
    toolService = TestBed.get(ToolsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.selector).not.toBeUndefined();
  });

  it('something selected should change the boolean isPrimitivesSelected to true', () => {
    const point: Point = new Point(0, 0);
    const primitive: SVGPrimitive[] = [new Rectangle(new Color(0, 0, 0), new Color(255, 255, 255),
    DEFAULT_STROKE_WIDTH, StrokeType.Full, point)];
    controllerService.setPrimitives(primitive);
    toolService.newToolSelected(ToolType.SelectorTool);
    const selectorTool = toolService.TOOLS.get((ToolType.SelectorTool)) as SelectorTool;
    selectorTool.mouseEvent(MouseEventType.MouseDownRight, point, primitive[0]);
    selectorTool.mouseEvent(MouseEventType.MouseUpRight, point, primitive[0]);
    expect(component.isPrimitiveSelected).toBe(true);
  });

  it('copy function is properly called', () => {
    spyOn(component.selector, 'copy');
    component.copy();
    expect(component.selector.copy).toHaveBeenCalled();
  });

  it('cut function is properly called', () => {
    spyOn(component.selector, 'cut');
    component.cut();
    expect(component.selector.cut).toHaveBeenCalled();
  });

  it('pasting function is properly called', () => {
    spyOn(component.selector, 'paste');
    component.paste();
    expect(component.selector.paste).toHaveBeenCalled();
  });

  it('deletion function is properly called', () => {
    spyOn(component.selector, 'delete');
    component.delete();
    expect(component.selector.delete).toHaveBeenCalled();
  });

  it('duplication function is properly called', () => {
    spyOn(component.selector, 'duplicate');
    component.duplicate();
    expect(component.selector.duplicate).toHaveBeenCalled();
  });

  it('selection of all primtives is properly called', () => {
    spyOn(component.selector, 'takeAll');
    component.takeAll();
    expect(component.selector.takeAll).toHaveBeenCalled();
  });

  it('properly detects if clipboard is empty', () => {
    expect(component.selector.isClipboardEmpty()).toBe(true);
    component.selector['clipboardService'].getPrimitives().push(new Path(Color.BLACK, 1, 1));
    expect(component.selector.isClipboardEmpty()).toBe(false);
  });

  it('grid alignement change from dropdown', () => {
    component['gridAlignment'] = GridAlignment.BottomRight;
    component.onChangeGridAlignment();
    expect(component.selector.gridAlignment).toBe(GridAlignment.BottomRight);

    component['gridAlignment'] = 999;
    component.onChangeGridAlignment();
    expect(component.selector.gridAlignment).toBe(GridAlignment.BottomRight);
    expect(component['gridAlignment']).toBe(GridAlignment.BottomRight);
  });

  it('grid alignement change from visual selector is properly handled', () => {
    component.changeGridAlignmentFromDrawing(GridAlignment.CenterRight);
    expect(component.selector.gridAlignment).toBe(GridAlignment.CenterRight);
  });

  it('rotation is properly changed', () => {
    const primitive : SVGPrimitive = new Path(Color.BLACK, 1, 1);
    primitive.selected = true;
    component.rotationAngle = 15;
    component.selector['rotationService'] = new RotationService();
    component.selector['rotationService'].rotatingSelection.push(primitive);
    component.onChangeRotation();
    expect(component.rotationAngle).toBe(15);
    expect(component.selector['angle']).toBe(15);

    component.rotationAngle = 500;
    component.onChangeRotation();
    expect(component.rotationAngle).toBe(MAX_ROTATION_ANGLE);
    expect(component.selector['angle']).toBe(MAX_ROTATION_ANGLE);

    component.rotationAngle = -1;
    component.onChangeRotation();
    expect(component.rotationAngle).toBe(MIN_ROTATION_ANGLE);
    expect(component.selector['angle']).toBe(MIN_ROTATION_ANGLE);
  });

  it('rotation is properly applied', () => {
    component['applyRotation'](-10);
    expect(component.rotationAngle).toBe(350);

    component['applyRotation'](20);
    expect(component.rotationAngle).toBe(20);

    component['applyRotation'](380);
    expect(component.rotationAngle).toBe(0);
  });
});
