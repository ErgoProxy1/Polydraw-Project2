import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MAX_STROKE_WIDTH, MIN_STROKE_WIDTH} from 'src/app/services/utils/constantsAndEnums';
import { RoutingConstants } from 'src/app/services/utils/routingConstants';
import { ShapePropertiesComponent } from './shape-properties.component';

describe('ShapePropertiesComponent', () => {
  let component: ShapePropertiesComponent;
  let fixture: ComponentFixture<ShapePropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShapePropertiesComponent ],
      imports: [FormsModule, HttpClientModule, RouterTestingModule.withRoutes([
        { path: RoutingConstants.ROUTE_TO_SHAPE, component: ShapePropertiesComponent },
        { path: RoutingConstants.ROUTE_TO_SHAPE + '/:shapeType', component: ShapePropertiesComponent },
      ])],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly update the tool\'s strokeWidth if input is a valid value', () => {
    setInputValue('#strokewidthinput', String(Math.round((MAX_STROKE_WIDTH + MIN_STROKE_WIDTH) / 2)));
    expect(component.tool.strokeWidth).toEqual(Math.round((MAX_STROKE_WIDTH + MIN_STROKE_WIDTH) / 2));
  });

  it('should set the tool\'s strokeWidth to minimum value if input value is too low', () => {
    setInputValue('#strokewidthinput', String(MIN_STROKE_WIDTH - MAX_STROKE_WIDTH));
    expect(component.tool.strokeWidth).toEqual(MIN_STROKE_WIDTH);
  });

  const setInputValue = (selector: string, value: string) => {
    const input = fixture.nativeElement.querySelector(selector);
    input.value = value;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  };

  it('should set the tool\'s strokeWidth to maximum value if input value is too high', () => {
    setInputValue('#strokewidthinput', String(MAX_STROKE_WIDTH + MAX_STROKE_WIDTH));
    expect(component.tool.strokeWidth).toEqual(MAX_STROKE_WIDTH);
  });
  it('should set the tool numberOfSides to the right value when the input is set ', () => {
    component.setNumberOfSide(6);
    expect(component.getNumberOfSide()).toEqual(6);

  });
});
