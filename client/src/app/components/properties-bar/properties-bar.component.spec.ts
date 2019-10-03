import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ColorToolComponent } from '../color-tool/color-tool.component';
import { PropertiesBarComponent } from './properties-bar.component';

describe('PropertiesBarComponent', () => {
  let component: PropertiesBarComponent;
  let fixture: ComponentFixture<PropertiesBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertiesBarComponent, ColorToolComponent ],
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
