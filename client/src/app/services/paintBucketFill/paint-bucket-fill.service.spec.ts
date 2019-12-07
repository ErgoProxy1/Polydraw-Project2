import { FillingPath } from '../svgPrimitives/path/fillPath/fillPath';
import { Color } from '../utils/color';
import { Contouring, PrimitiveType, StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { PaintBucketFillService } from './paint-bucket-fill.service';
// tslint:disable: no-string-literal

describe('PaintBucketFillService', () => {
  let service: PaintBucketFillService;
  const createContext = (width: number, height: number): CanvasRenderingContext2D => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas.getContext('2d') as CanvasRenderingContext2D;
  };
  beforeEach(() => {
    service = new PaintBucketFillService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // setup informations
  it('should correctly setup information', () => {
    const width = 200;
    const height = 455;
    const canvas = createContext(width, height);
    const fillingPath = new FillingPath(new Color(123, 123, 123), new Color(123, 123, 123),
      3, PrimitiveType.Fill, StrokeType.FullWithOutline);
    service.setUpInfos(canvas, width, height, 15, fillingPath);
    expect(service['tolerance']).toEqual(15);
    expect(service['canvasWidth']).toEqual(width);
    expect(service['canvasHeight']).toEqual(height);
    expect(service['canvas']).toEqual(canvas);
    expect(service['fillingPath']).toEqual(fillingPath);
    expect(service['pixelTable'].length).toEqual(width);
    for (const temp of service['pixelTable']) {
      expect(temp.length).toEqual(height);
    }
    expect(service['contourPixels'].length).toEqual(width);
    for (const temp of service['contourPixels']) {
      expect(temp.length).toEqual(height);
    }
    expect(service['pixels'].length).toEqual(width * height * 4);

  });

  // time exceeded
  it('Time exceeded should works correctly', () => {
    service['startTime'] = Date.now();
    expect(service['isTimeExceeded']()).toBe(false);
    service['startTime'] = Date.now() - 6000;
    expect(service['isTimeExceeded']()).toBe(true);

  });

  // start Filling
  it('Start filling should act as suppose to', () => {
    service['fillingPath'] = new FillingPath(new Color(123, 123, 123), new Color(123, 123, 123),
      3, PrimitiveType.Fill, StrokeType.FullWithOutline);
    service['firstPixelColor'] = new Color(123, 123, 123, 1);
    service['tolerance'] = 10;
    service['canvasWidth'] = 6;
    service['pixels'] = new Uint8ClampedArray([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 123, 123, 123, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 123, 123, 123, 1, 123, 123, 123, 1, 0, 0, 0, 0, 0, 0, 0, 0,
      123, 123, 123, 1, 123, 123, 123, 1, 123, 123, 123, 1, 123, 123, 123, 1, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 123, 123, 123, 1, 123, 123, 123, 1, 123, 123, 123, 1, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 123, 123, 123, 1, 123, 123, 123, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 123, 123, 123, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
    service['canvasHeight'] = 8;
    service['pixelTable'] = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ];
    service['contourPixels'] = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ];
    service['startTime'] = Date.now();
    service.startFilling(new Point(2, 3));
    expect(service['topLeftShape']).toEqual(new Point(0, 1));
    expect(service['bottomRightShape']).toEqual(new Point(3, 6));
    expect(service['pixelTable'][2][1]).toEqual(1);
    expect(service['pixelTable'][3][4]).toEqual(1);
    expect(service['pixelTable'][0][3]).toEqual(1);
    expect(service['pixelTable'][1][5]).toEqual(1);
    const dummyPoints = [new Point(3, 3), new Point(0, 3), new Point(3, 4), new Point(1, 4), new Point(3, 2), new Point(2, 2),
    new Point(2, 5), new Point(1, 5), new Point(2, 1), new Point(2, 1), new Point(2, 6), new Point(2, 6)];
    expect(service['fillingPath'].fillingPoints).toEqual(dummyPoints);

    const dummyMap: Contouring[] = [];
    dummyMap.push({
      type: 'm',
      points: [new Point(0, 3)],
    });
    dummyMap.push({
      type: 'c',
      points: [new Point(0, 3), new Point(1, 5), new Point(3, 2)],
    });

    expect(service['fillingPath'].contourPoints).toEqual(dummyMap);
  });

  // find shape
  it('should correctly find the shape', () => {
    service['fillingPath'] = new FillingPath(new Color(123, 123, 123), new Color(123, 123, 123),
      3, PrimitiveType.Fill, StrokeType.FullWithOutline);
    service['firstPixelColor'] = new Color(123, 123, 123, 1);
    service['tolerance'] = 10;
    service['canvasWidth'] = 6;
    service['pixels'] = new Uint8ClampedArray([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 123, 123, 123, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 123, 123, 123, 1, 123, 123, 123, 1, 0, 0, 0, 0, 0, 0, 0, 0,
      123, 123, 123, 1, 123, 123, 123, 1, 123, 123, 123, 1, 123, 123, 123, 1, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 123, 123, 123, 1, 123, 123, 123, 1, 123, 123, 123, 1, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 123, 123, 123, 1, 123, 123, 123, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 123, 123, 123, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
    service['canvasHeight'] = 8;
    service['pixelTable'] = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ];
    service['startTime'] = Date.now();
    service['findShape'](2, 3);
    expect(service['topLeftShape']).toEqual(new Point(0, 1));
    expect(service['bottomRightShape']).toEqual(new Point(3, 6));
    expect(service['pixelTable'][2][1]).toEqual(1);
    expect(service['pixelTable'][3][4]).toEqual(1);
    expect(service['pixelTable'][0][3]).toEqual(1);
    expect(service['pixelTable'][1][5]).toEqual(1);
    const dummyPoints = [new Point(3, 3), new Point(0, 3), new Point(3, 4), new Point(1, 4), new Point(3, 2), new Point(2, 2),
    new Point(2, 5), new Point(1, 5), new Point(2, 1), new Point(2, 1), new Point(2, 6), new Point(2, 6)];
    expect(service['fillingPath'].fillingPoints).toEqual(dummyPoints);
  });

  // draw contour
  it('Should correctly draw the contour', () => {
    service['pixelTable'] = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    service['contourPixels'] = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    service['fillingPath'] = new FillingPath(new Color(123, 123, 123), new Color(123, 123, 123),
      3, PrimitiveType.Fill, StrokeType.FullWithOutline);
    service['topLeftShape'] = new Point(1, 3);
    service['bottomRightShape'] = new Point(10, 21);
    service['startTime'] = Date.now();
    service['canvasWidth'] = 12;
    service['canvasHeight'] = 26;
    service['drawContour']();
    const dummyMap: Contouring[] = [];
    dummyMap.push({
      type: 'm',
      points: [new Point(2, 5)],
    });
    dummyMap.push({
      type: 'c',
      points: [new Point(2, 5), new Point(2, 9), new Point(2, 13)],
    });
    dummyMap.push({
      type: 'c',
      points: [new Point(2, 15), new Point(2, 19), new Point(6, 20)],
    });
    dummyMap.push({
      type: 'c',
      points: [new Point(8, 20), new Point(10, 17), new Point(10, 13)],
    });
    dummyMap.push({
      type: 'c',
      points: [new Point(10, 11), new Point(10, 7), new Point(9, 4)],
    });
    dummyMap.push({
      type: 'c',
      points: [new Point(7, 4), new Point(5, 4), new Point(3, 4)],
    });

    expect(service['fillingPath'].contourPoints).toEqual(dummyMap);

    service['pixelTable'] = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    service['contourPixels'] = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    service['fillingPath'] = new FillingPath(new Color(123, 123, 123), new Color(123, 123, 123),
      3, PrimitiveType.Fill, StrokeType.FullWithOutline);
    service['topLeftShape'] = new Point(1, 3);
    service['bottomRightShape'] = new Point(10, 21);
    service['startTime'] = Date.now();
    service['canvasWidth'] = 12;
    service['canvasHeight'] = 26;
    service['drawContour']();
    const dummyMap2: Contouring[] = [];
    dummyMap2.push({
      type: 'm',
      points: [new Point(2, 5)],
    });
    dummyMap2.push({
      type: 'c',
      points: [new Point(2, 5), new Point(3, 9), new Point(2, 13)],
    });
    dummyMap2.push({
      type: 'c',
      points: [new Point(2, 15), new Point(2, 19), new Point(6, 20)],
    });
    dummyMap2.push({
      type: 'c',
      points: [new Point(8, 20), new Point(7, 19), new Point(7, 15)],
    });
    dummyMap2.push({
      type: 'c',
      points: [new Point(5, 17), new Point(5, 18), new Point(5, 19)],
    });
    dummyMap2.push({
      type: 'm',
      points: [new Point(2, 8)],
    });
    dummyMap2.push({
      type: 'c',
      points: [new Point(2, 8), new Point(2, 10), new Point(2, 11)],
    });
    dummyMap2.push({
      type: 'm',
      points: [new Point(3, 4)],
    });
    dummyMap2.push({
      type: 'c',
      points: [new Point(3, 4), new Point(6, 5), new Point(6, 9)],
    });
    dummyMap2.push({
      type: 'c',
      points: [new Point(6, 11), new Point(8, 14), new Point(10, 17)],
    });
    dummyMap2.push({
      type: 'm',
      points: [new Point(4, 7)],
    });
    dummyMap2.push({
      type: 'c',
      points: [new Point(4, 7), new Point(5, 9), new Point(5, 10)],
    });
    dummyMap2.push({
      type: 'm',
      points: [new Point(6, 14)],
    });
    dummyMap2.push({
      type: 'l',
      points: [new Point(6, 14)],
    });

    expect(service['fillingPath'].contourPoints).toEqual(dummyMap2);
  });

  // Création du tableau de contour
  it('Should correctly create the contour table of pixel', () => {
    service['pixelTable'] = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    service['contourPixels'] = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    const expectedContour = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    service['topLeftShape'] = new Point(1, 3);
    service['bottomRightShape'] = new Point(10, 21);
    service['startTime'] = Date.now();
    service['canvasWidth'] = 12;
    service['canvasHeight'] = 26;
    service['createContour']();
    expect(service['contourPixels']).toEqual(expectedContour);

  });

  // si un pixel match avec le pixel de départ, selon sa possition
  it('Should Match the color by passing the pixel position', () => {
    service['canvasWidth'] = 2;
    service['tolerance'] = 10;
    service['firstPixelColor'] = new Color(255, 0, 0, 1);
    service['pixels'] = new Uint8ClampedArray([255, 0, 0, 1, 250, 3, 0, 1, 123, 123, 123, 1, 18, 18, 23, 1]);
    expect(service['isPixelMatching'](0, 0)).toBe(true);
    expect(service['isPixelMatching'](1, 0)).toBe(true);
    service['tolerance'] = 100;
    expect(service['isPixelMatching'](1, 1)).toBe(true);
  });

  it('Shouldn\'n Match the color by passing the pixel position', () => {
    service['canvasWidth'] = 2;
    service['tolerance'] = 10;
    service['firstPixelColor'] = new Color(255, 0, 0, 1);
    service['pixels'] = new Uint8ClampedArray([255, 0, 0, 1, 0, 255, 0, 1, 123, 123, 123, 1, 18, 18, 23, 1]);
    expect(service['isPixelMatching'](1, 0)).toBe(false);
    expect(service['isPixelMatching'](1, 1)).toBe(false);
    expect(service['isPixelMatching'](0, 1)).toBe(false);
  });

  // Récupérer le pixels selon un x et un y
  it('Should return the correct pixel color', () => {
    service['canvasWidth'] = 2;
    service['pixels'] = new Uint8ClampedArray([255, 0, 0, 1, 0, 255, 0, 1, 123, 123, 123, 1, 18, 18, 23, 1]);
    expect(service['getPixelColor'](0, 0)).toEqual(new Color(255, 0, 0, 1));
    expect(service['getPixelColor'](0, 1)).toEqual(new Color(123, 123, 123, 1));
    expect(service['getPixelColor'](1, 1)).toEqual(new Color(18, 18, 23, 1));
    expect(service['getPixelColor'](1, 0)).toEqual(new Color(0, 255, 0, 1));
  });

  // generatePixelTable
  it('Should create an array of the correct size depending of the width and the height of the canvas and all set to 0', () => {
    const width = 2000;
    const height = 1000;
    service['canvasWidth'] = width;
    service['canvasHeight'] = height;
    const array = service['generatePixelTable']();
    expect(array.length).toEqual(width);
    for (const column of array) {
      expect(column.length).toEqual(height);
    }
    for (const column of array) {
      for (const line of column) {
        expect(line).toEqual(0);
      }
    }
  });

  // get les pixels du canavs
  it('Should create an array of pixels', () => {
    const width = 2000;
    const height = 1000;
    service['canvasWidth'] = width;
    service['canvasHeight'] = height;
    service['canvas'] = createContext(width, height);
    service['canvas'].drawImage(new Image(width, height), width, height);
    service['getPixels']();
    expect(service['pixels'].length).toEqual(width * height * 4);
  });
});
