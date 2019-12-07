import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { MAX_SPRAYPAINT_RANGE, MIN_SPRAYPAINT_RANGE } from 'src/app/services/utils/constantsAndEnums';
import { SpraypaintPropertiesComponent } from './spraypaint-properties.component';

// tslint:disable: no-string-literal
describe('SpraypaintPropertiesComponent', () => {
  let component: SpraypaintPropertiesComponent;
  let fixture: ComponentFixture<SpraypaintPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpraypaintPropertiesComponent ],
      imports: [FormsModule, HttpClientModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpraypaintPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be properly created', () => {
    expect(component).toBeTruthy();
    expect(component['range']).toBe(30);
    expect(component['paintDelay']).toBe(10);
    expect(component.spraypaint).not.toBeUndefined();
  });

  it('range is properly updated', () => {
    component.onChangeRange();
    expect(component.spraypaint.range).toBe(30);

    component['range'] = 500;
    component.onChangeRange();
    expect(component.spraypaint.range).toBe(MAX_SPRAYPAINT_RANGE);

    component['range'] = -1;
    component.onChangeRange();
    expect(component.spraypaint.range).toBe(MIN_SPRAYPAINT_RANGE);
  });

  it('delay between sprays is properly updated', () => {
    component.onChangePaintDelay();
    expect(component.spraypaint.paintDelay).toBe(100);

    component['paintDelay'] = 500;
    component.onChangePaintDelay();
    expect(component.spraypaint.paintDelay).toBe(2);

    component['paintDelay'] = -1;
    component.onChangePaintDelay();
    expect(component.spraypaint.paintDelay).toBe(200);
  });
});
