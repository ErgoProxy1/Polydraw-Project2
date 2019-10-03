import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColorToolComponent } from 'src/app/components/color-tool/color-tool.component';
import { ColorPropertiesComponent } from './color-properties.component';

describe('ColorPropertiesComponent', () => {
  let component: ColorPropertiesComponent;
  let fixture: ComponentFixture<ColorPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPropertiesComponent, ColorToolComponent ],
      imports: [FormsModule, ReactiveFormsModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
