import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NTimesPipe } from 'src/app/pipes/n-times.pipe';
import { CanvasComponent } from '../canvas.component';
import { SvgComponent } from './svg.component';

describe('SvgComponent', () => {
  let component: SvgComponent;
  let fixture: ComponentFixture<SvgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgComponent, CanvasComponent, NTimesPipe ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.FILTER_IDS.length).toBe(5);
    expect(component.FILTER_IDS[0]).toBe('basic');
    expect(component.FILTER_IDS[4]).toBe('degraded');
    expect(component.FILTER_IDS[5]).toBeUndefined();
  });
});
