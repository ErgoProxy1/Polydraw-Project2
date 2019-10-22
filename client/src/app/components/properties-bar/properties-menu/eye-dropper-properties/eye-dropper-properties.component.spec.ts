import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EyeDropperPropertiesComponent } from './eye-dropper-properties.component';

describe('EyeDropperPropertiesComponent', () => {
  let component: EyeDropperPropertiesComponent;
  let fixture: ComponentFixture<EyeDropperPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EyeDropperPropertiesComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EyeDropperPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
