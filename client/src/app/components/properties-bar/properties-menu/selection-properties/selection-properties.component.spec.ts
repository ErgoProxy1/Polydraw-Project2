import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ControllerService } from 'src/app/services/controller/controller.service';
import { Rectangle } from 'src/app/services/svgPrimitives/rectangle/rectangle';
import { SVGPrimitive } from 'src/app/services/svgPrimitives/svgPrimitive';
import { SelectorTool } from 'src/app/services/tools/selectorTool';
import { ToolsService } from 'src/app/services/tools/tools.service';
import { Color } from 'src/app/services/utils/color';
import { DEFAULT_STROKE_WIDTH, MouseEventType, StrokeType, ToolType } from 'src/app/services/utils/constantsAndEnums';
import { Point } from 'src/app/services/utils/point';
import { SelectionPropertiesComponent } from './selection-properties.component';

describe('SelectionPropertiesComponent', () => {
  let component: SelectionPropertiesComponent;
  let fixture: ComponentFixture<SelectionPropertiesComponent>;
  let controllerService: ControllerService;
  let toolService: ToolsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionPropertiesComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    controllerService = TestBed.get(ControllerService);
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
    const selectorTool = toolService.tools.get((ToolType.SelectorTool)) as SelectorTool;
    selectorTool.mouseEvent(MouseEventType.MouseClickRight, point, primitive[0]);
    expect(component.isPrimitiveSelected).toBe(true);
  });
});
