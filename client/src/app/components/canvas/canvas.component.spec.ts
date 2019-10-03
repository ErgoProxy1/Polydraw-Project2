import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Color } from 'src/app/services/utils/color';
import { CanvasComponent } from './canvas.component';

describe('CanvasComponent', () => {
  let component: CanvasComponent;
  let fixture: ComponentFixture<CanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CanvasComponent],
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
    expect(component.filterIds.length).toBe(5);
    expect(component.filterIds[0]).toBe('basic');
    expect(component.filterIds[4]).toBe('frothy');
    expect(component.filterIds[5]).toBeUndefined();
    expect(component.canvasHeight).toBe(0);

    expect(component.canvasBackground).toBeUndefined();
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
    expect(component.primitives.length).toEqual(0);
  });

  it('#onMouseMove should update the primitives attribute', () => {
    const initialPrimitives = component.primitives;
    spyOn(component, 'onMouseMove');
    const primSize = component.primitives.length;
    component.onMouseMove(new PointerEvent('MouseMove'));
    expect(component.primitives.length).toBeGreaterThanOrEqual(initialPrimitives.length);
    expect(component.primitives[primSize - 1]).toEqual(initialPrimitives[primSize - 1]);
    expect(component.primitives[primSize]).toBeUndefined();
  });

  it('#onKeyDown should update the primitives attribute', () => {
    const initialPrimitives = component.primitives;
    spyOn(component, 'onKeyDown');
    component.onKeyDown(new KeyboardEvent('onKeyDown'));
    expect(component.primitives.length).toBeGreaterThanOrEqual(initialPrimitives.length);
  });

  it('#onKeyUp should update the primitives attribute', () => {
    const initialPrimitives = component.primitives;
    spyOn(component, 'onKeyUp');
    component.onKeyUp(new KeyboardEvent('onKeyUp'));
    expect(component.primitives.length).toBeGreaterThanOrEqual(initialPrimitives.length);
  });

  it('#primitiveLeftClicked should select the primitives', () => {
    const initialPrimitives = component.primitives;
    spyOn(component, 'primitiveLeftClicked');
    const primitive = component.primitives[0];
    component.primitiveLeftClicked(new MouseEvent('leftClick'), primitive);
    expect(component.primitives[0]).toEqual(primitive);
    expect(component.primitives).toEqual(initialPrimitives);
  });

  it('#primitiveRightClicked should unselect the current primitive', () => {
    const initialPrimitives = component.primitives;
    spyOn(component, 'primitiveLeftClicked');
    const primitive = component.primitives[0];
    component.primitiveRightClicked(new MouseEvent('rightClick'), primitive);
    expect(component.primitives[0]).toEqual(primitive);
    expect(component.primitives.length).toEqual(initialPrimitives.length);
  });

});
