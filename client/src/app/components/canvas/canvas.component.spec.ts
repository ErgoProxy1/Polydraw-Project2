import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NTimesPipe } from 'src/app/pipes/n-times.pipe';
import { Color } from 'src/app/services/utils/color';
import { CanvasComponent } from './canvas.component';

describe('CanvasComponent', () => {
  let component: CanvasComponent;
  let fixture: ComponentFixture<CanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CanvasComponent, NTimesPipe],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    expect(component.canvasWidth).toBe(0);
    expect(component.FILTER_IDS.length).toBe(5);
    expect(component.FILTER_IDS[0]).toBe('basic');
    expect(component.FILTER_IDS[4]).toBe('frothy');
    expect(component.FILTER_IDS[5]).toBeUndefined();
    expect(component.canvasHeight).toBe(0);

    expect(component.canvasBackground).toBe('rgba(255,255,255,1)');
  });

  it('#defineDimensions should change the canvas widht and height to the given values', () => {
    let width = 150;
    let height = 200;

    component.defineDimensions(width, height);
    expect(component.canvasWidth).toEqual(150);
    expect(component.canvasHeight).toEqual(200);

    width = -100;
    expect(() => {
      component.defineDimensions(width, height);
    }).toThrowError('Canvas width and height must be positive.');

    height = -300;
    expect(() => {
      component.defineDimensions(width, height);
    }).toThrowError('Canvas width and height must be positive.');

    width = height = -1;
    expect(() => {
      component.defineDimensions(width, height);
    }).toThrowError('Canvas width and height must be positive.');
  });

  it('#defineBackgroundColor should change the background color to the given value', () => {
    const color = new Color(200, 250, 120, 1);
    component.defineBackgroundColor(color);
    expect(component.canvasBackground).toEqual('rgba(200,250,120,1)');
  });

  it('#clearCanvas should clear the canvas', () => {
    component.clearCanvas();
    expect(component.getPrimitives().length).toEqual(0);
  });

  it('#mouseMoveOnCanvas should update the primitives attribute', () => {
    const initialPrimitives = component.getPrimitives();
    spyOn(component, 'mouseMoveOnCanvas');
    const primSize = component.getPrimitives().length;
    component.mouseMoveOnCanvas(new PointerEvent('MouseMove'));
    expect(component.getPrimitives().length).toBeGreaterThanOrEqual(initialPrimitives.length);
    expect(component.getPrimitives()[primSize - 1]).toEqual(initialPrimitives[primSize - 1]);
    expect(component.getPrimitives()[primSize]).toBeUndefined();
  });

  it('#onKeyDown should update the primitives attribute', () => {
    const initialPrimitives = component.getPrimitives();
    spyOn(component, 'onKeyDown');
    component.onKeyDown(new KeyboardEvent('onKeyDown'));
    expect(component.getPrimitives().length).toBeGreaterThanOrEqual(initialPrimitives.length);
  });

  it('#onKeyUp should update the primitives attribute', () => {
    const initialPrimitives = component.getPrimitives();
    spyOn(component, 'onKeyUp');
    component.onKeyUp(new KeyboardEvent('onKeyUp'));
    expect(component.getPrimitives().length).toBeGreaterThanOrEqual(initialPrimitives.length);
  });

  it('#clickOnCanvas should select the primitives with a leftClick', () => {
    const initialPrimitives = component.getPrimitives();
    spyOn(component, 'clickOnCanvas');
    const primitive = component.getPrimitives()[0];
    component.clickOnCanvas(new MouseEvent('leftClick'), primitive);
    expect(component.getPrimitives()[0]).toEqual(primitive);
    expect(component.getPrimitives()).toEqual(initialPrimitives);
  });

  it('#clickOnCanvas should unselect the current primitive with a rightClick', () => {
    const initialPrimitives = component.getPrimitives();
    spyOn(component, 'clickOnCanvas');
    const primitive = component.getPrimitives()[0];
    component.clickOnCanvas(new MouseEvent('rightClick'), primitive);
    expect(component.getPrimitives()[0]).toEqual(primitive);
    expect(component.getPrimitives().length).toEqual(initialPrimitives.length);
  });

});
