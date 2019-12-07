import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { RotateCommand } from '../toolCommands/rotateCommand';
import { Color } from '../utils/color';
import { DEFAULT_STROKE_WIDTH, KeyboardEventType, ORIGIN, StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { RotationService } from './rotation.service';

// tslint:disable: no-string-literal
describe('RotationService', () => {
  let service: RotationService;
  beforeEach(() => service = new RotationService());

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.rotationAngle).toEqual(0);
    expect(service['rotationRate']).toEqual(15);
    expect(service['rotationAngleSubject']).not.toBeUndefined();
    expect(service['isAroundPrimitiveCenter']).toBe(false);
    expect(service['boundingBoxCenter']).toEqual(ORIGIN);
  });
  it('should set/unset the rotation around primitives center after shift Down', () => {
    expect(service['isAroundPrimitiveCenter']).toBe(false);
    service.keyboardEvent(KeyboardEventType.ShiftDown);
    expect(service['isAroundPrimitiveCenter']).toBe(true);
    service.keyboardEvent(KeyboardEventType.ShiftUp);
    expect(service['isAroundPrimitiveCenter']).toBe(false);
  });
  it('should set/unset the rotation rate to 1 after Alt Down', () => {
    expect(service['rotationRate']).toEqual(15);
    service.keyboardEvent(KeyboardEventType.AltDown);
    expect(service['rotationRate']).toEqual(1);
    service.keyboardEvent(KeyboardEventType.AltUp);
    expect(service['rotationRate']).toEqual(15);
  });
  it('should\'nt change anything if KeyboardEvent different from AltDown and ShiftDown' , () => {
    service.keyboardEvent(KeyboardEventType.EscapeDown);
    service.keyboardEvent(KeyboardEventType.BackspaceDown);
    expect(service['rotationRate']).toEqual(15);
    expect(service['isAroundPrimitiveCenter']).toBe(false);
  });

  it('an altDown before a ShiftDown and vice versa should change the attributes', () => {
    service.keyboardEvent(KeyboardEventType.ShiftDown);
    service.keyboardEvent(KeyboardEventType.AltDown);
    expect(service['rotationRate']).toEqual(1);
    expect(service['isAroundPrimitiveCenter']).toBe(true);
    service.keyboardEvent(KeyboardEventType.ShiftUp);
    service.keyboardEvent(KeyboardEventType.AltUp);
    service.keyboardEvent(KeyboardEventType.AltDown);
    service.keyboardEvent(KeyboardEventType.ShiftDown);
    expect(service['rotationRate']).toEqual(1);
    expect(service['isAroundPrimitiveCenter']).toBe(true);
  });
  it('should set the new angle', () => {
    const newAngle = 220;
    service.setNewAngle(newAngle);
    expect(service['rotationAngle']).toEqual(220);
  });
  it('should update the bounding box center when newSelection', () => {
    const primitive: SVGPrimitive[] = [new Rectangle(Color.BLACK, Color.WHITE, DEFAULT_STROKE_WIDTH, StrokeType.FullWithOutline,
      new Point(0, 0), 20, 20)];
    const point: Point = new Point(50, 50);
    service.beginRotation(primitive, point, true);
    expect(service['boundingBoxCenter']).toEqual(point);
  });
  it('rotationService should contain the selected primitives in memory', () => {
    const primitive: SVGPrimitive[] = [new Rectangle(Color.BLACK, Color.WHITE, DEFAULT_STROKE_WIDTH, StrokeType.FullWithOutline,
      new Point(0, 0), 20, 20)];
    const point: Point = new Point(50, 50);
    service.beginRotation(primitive, point, true);
    expect(service['rotatingSelection']).toContain(primitive[0]);
  });
  it('updateRotation should update the angle and rotate the primitive', () => {
    const primitive: SVGPrimitive[] = [new Rectangle(Color.BLACK, Color.WHITE, DEFAULT_STROKE_WIDTH, StrokeType.FullWithOutline,
      new Point(0, 0), 20, 20)];
    const point: Point = new Point(50, 50);
    service.beginRotation(primitive, point, true);
    const expectedAngle = 15;
    service.updateRotation(1);
    expect(service['rotationAngle']).toEqual(expectedAngle);
    expect(service['rotatingSelection'][0]['transformations']).toEqual(`rotate(15,50,50)scale(1,1) `);
  });
  it('endRotation should create the right command', () => {
    const primitive: SVGPrimitive[] = [new Rectangle(Color.BLACK, Color.WHITE, DEFAULT_STROKE_WIDTH, StrokeType.FullWithOutline,
      new Point(0, 0), 20, 20)];
    const point: Point = new Point(50, 50);
    service.beginRotation(primitive, point, true);
    service.updateRotation(1);
    service.endRotation(primitive);
    expect(service['rotatingSelection']).toEqual([]);
    expect(service['command']).toEqual(new RotateCommand(primitive, 15, false));
  });
  it('updateRotationFromProperties rotate the primitive', () => {
    const primitive: SVGPrimitive[] = [new Rectangle(Color.BLACK, Color.WHITE, DEFAULT_STROKE_WIDTH, StrokeType.FullWithOutline,
      new Point(0, 0), 20, 20)];
    const point: Point = new Point(50, 50);
    service.setNewAngle(15);
    service.beginRotation(primitive, point, true);
    service.updateRotationFromProperties(15);
    expect(service['rotationAngle']).toEqual(15);
    expect(service['rotatingSelection'][0]['transformations']).toEqual(`rotate(15,50,50)scale(1,1) `);
  });
  it('should get the current Rotating Selection', () => {
    const primitive: SVGPrimitive[] = [new Rectangle(Color.BLACK, Color.WHITE, DEFAULT_STROKE_WIDTH, StrokeType.FullWithOutline,
      new Point(0, 0), 20, 20)];
    const point: Point = new Point(50, 50);
    service.beginRotation(primitive, point, false);
    const returnedPrimitive: SVGPrimitive[] = service.getTemporaryPrimitives();
    expect(returnedPrimitive).toEqual(primitive);
  });
  it('should get the current rotation angle', () => {
    const expectedAngle = 78;
    service.setNewAngle(expectedAngle);
    const returnedAngle: number = service.getAngle();
    expect(returnedAngle).toEqual(expectedAngle);
  });
});
