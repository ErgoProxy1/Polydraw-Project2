import { RotateCommand } from './rotateCommand';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { Color } from '../utils/color';
import { DEFAULT_STROKE_WIDTH, StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';

describe('RotateToolCommandService', () => {
  let rotateCommand : RotateCommand;
  let primitive: SVGPrimitive[] = [new Rectangle(Color.BLACK, Color.WHITE, DEFAULT_STROKE_WIDTH, StrokeType.FullWithOutline,
    new Point(0, 0), 20, 20)];
  const angle : number = 15;
  let aroundCenter : boolean = false;
  beforeEach(() => rotateCommand = new RotateCommand(primitive,angle,aroundCenter));

  it('should be created', () => {
    expect(rotateCommand).toBeTruthy();
    expect(rotateCommand['primitivesSelected']).toEqual(primitive);
    expect(rotateCommand['angle']).toEqual(angle);
    expect(rotateCommand['aroundCenter']).toEqual(false);
  });
  
  it('should set the last centers of the selected primitives', () => {
    const origin : Point = new Point(10,10);
    primitive[0].setRotationGroupOrigin(new Point(0,0));
    rotateCommand.getCenter();
    expect(rotateCommand['centers'][0]).toEqual(origin);
    primitive[0].move(new Point(50,50));
    primitive[0].setRotationGroupOrigin(new Point(0,0));
    rotateCommand.getCenter();
    rotateCommand.setLastCenters();
    expect(rotateCommand['centers'][0]).toEqual(new Point(60,60));
    expect(primitive[0]['rotationCenterOrigin']).toEqual(new Point(60,60));
  })
});
