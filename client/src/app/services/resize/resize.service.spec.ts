import { TestBed } from '@angular/core/testing';
import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { ResizeCommand } from '../toolCommands/resizeCommand';
import { Color } from '../utils/color';
import { HandleType, StrokeType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { ResizeService } from './resize.service';

describe('ResizeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResizeService = TestBed.get(ResizeService);
    expect(service).toBeTruthy();
  });

  it('should return correct relative translation', () => {
    const service: ResizeService = TestBed.get(ResizeService);
    const boundingBox = new Rectangle(new Color(0, 0, 0, 0), Color.BLACK, 2, StrokeType.Outline, new Point(110, 110), 100, 100);
    // tslint:disable-next-line: no-string-literal
    service['initialBoundingBox'] = boundingBox;
    const insideRectangle = new Rectangle(new Color(0, 0, 0, 0), Color.BLACK, 2, StrokeType.Outline, new Point(155, 155), 10, 10);

    // Translation globale en X seulement
    // tslint:disable-next-line: no-string-literal
    service['handleType'] = HandleType.Right;
    // tslint:disable-next-line: no-string-literal
    service['scaleFactorX'] = 1.5;
    // tslint:disable-next-line: no-string-literal
    service['scaleFactorY'] = 1;
    const translationX = new Point(50, 0);
    // tslint:disable-next-line: no-string-literal
    service['translation'] = translationX;
    expect(service.getRelativeTranslation(insideRectangle)).toEqual(new Point(25, 0));

    // Translation globale en Y seulement
    // tslint:disable-next-line: no-string-literal
    service['handleType'] = HandleType.Bottom;
    // tslint:disable-next-line: no-string-literal
    service['scaleFactorX'] = 1;
    // tslint:disable-next-line: no-string-literal
    service['scaleFactorY'] = 1.5;
    const translationY = new Point(0, 50);
    // tslint:disable-next-line: no-string-literal
    service['translation'] = translationY;
    expect(service.getRelativeTranslation(insideRectangle)).toEqual(new Point(0, 25));

    // Translation globale combinée négative
    // tslint:disable-next-line: no-string-literal
    service['handleType'] = HandleType.BottomRight;
    // tslint:disable-next-line: no-string-literal
    service['scaleFactorX'] = -0.5;
    // tslint:disable-next-line: no-string-literal
    service['scaleFactorY'] = -0.5;
    const translationXY = new Point(-150, -150);
    // tslint:disable-next-line: no-string-literal
    service['translation'] = translationXY;
    expect(service.getRelativeTranslation(insideRectangle)).toEqual(new Point(-75, -75));
  });

  it('should return correct boolean for TopHandle', () => {
    const service: ResizeService = TestBed.get(ResizeService);
    // tslint:disable-next-line: no-string-literal
    expect(service['isTopHandle'](HandleType.Bottom)).toBe(false);
    // tslint:disable-next-line: no-string-literal
    expect(service['isTopHandle'](HandleType.TopLeft)).toBe(true);
  });

  it('should return correct boolean for LeftHandle', () => {
    const service: ResizeService = TestBed.get(ResizeService);
    // tslint:disable-next-line: no-string-literal
    expect(service['isLeftHandle'](HandleType.Bottom)).toBe(false);
    // tslint:disable-next-line: no-string-literal
    expect(service['isLeftHandle'](HandleType.TopLeft)).toBe(true);
  });

  it('should get the correct X scale factor', () => {
    const service: ResizeService = TestBed.get(ResizeService);
    // tslint:disable-next-line: no-string-literal
    service['scaleFactorX'] = -1;
    expect(service.getScaleFactorX()).toEqual(-1);
    // tslint:disable-next-line: no-string-literal
    service['scaleFactorX'] = 0;
    expect(service.getScaleFactorX()).toEqual(0);
    // tslint:disable-next-line: no-string-literal
    service['scaleFactorX'] = 10;
    expect(service.getScaleFactorX()).toEqual(10);
  });

  it('should get the correct Y scale factor', () => {
    const service: ResizeService = TestBed.get(ResizeService);
    // tslint:disable-next-line: no-string-literal
    service['scaleFactorY'] = -1;
    expect(service.getScaleFactorY()).toEqual(-1);
    // tslint:disable-next-line: no-string-literal
    service['scaleFactorY'] = 0;
    expect(service.getScaleFactorY()).toEqual(0);
    // tslint:disable-next-line: no-string-literal
    service['scaleFactorY'] = 10;
    expect(service.getScaleFactorY()).toEqual(10);
  });

  it('should endResize correctly', () => {
    const service: ResizeService = TestBed.get(ResizeService);
    const boundingBox = new Rectangle(new Color(0, 0, 0, 0), Color.BLACK, 2, StrokeType.Outline, new Point(110, 110), 100, 100);
    // tslint:disable-next-line: no-string-literal
    service['initialBoundingBox'] = boundingBox;
    // tslint:disable-next-line: no-string-literal
    service['handleType'] = HandleType.TopRight;
    const insideRectangle = new Rectangle(new Color(0, 0, 0, 0), Color.BLACK, 2, StrokeType.Outline, new Point(155, 155), 10, 10);
    const translation = new Point(50, 50);
    const primitives: SVGPrimitive[] = [];
    primitives.push(insideRectangle);
    const map = new Map<number, Point>();
    map.set(0, new Point(25, 25));
    const command = new ResizeCommand(primitives, map, 1.5, 0.5);
    service.endResize(primitives, translation, false, false);
    // tslint:disable-next-line: no-string-literal
    expect(service['resizeSelection'].length).toEqual(0);
    expect(service.getScaleFactorX()).toEqual(1.5);
    expect(service.getScaleFactorY()).toEqual(0.5);
    expect(service.endResize(primitives, translation, false, false)).toEqual(command);
  });

  it('should updateResize correctly', () => {
    const service: ResizeService = TestBed.get(ResizeService);
    const boundingBox = new Rectangle(new Color(0, 0, 0, 0), Color.BLACK, 2, StrokeType.Outline, new Point(110, 110), 100, 100);
    // tslint:disable-next-line: no-string-literal
    service['initialBoundingBox'] = boundingBox;
    // tslint:disable-next-line: no-string-literal
    service['handleType'] = HandleType.Right;
    const insideRectangle = new Rectangle(new Color(0, 0, 0, 0), Color.BLACK, 2, StrokeType.Outline, new Point(155, 155), 10, 10);
    const translation = new Point(50, 0);
    const primitives: SVGPrimitive[] = [];
    primitives.push(insideRectangle);
    service.updateResize(primitives, translation, false, false);
    expect(service.getTranslation()).toEqual(translation);
    // tslint:disable-next-line: no-string-literal
    expect(service['resizeSelection'].length).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(1);
    expect(service.getScaleFactorX()).toEqual(1.5);
  });

  it('should beginResize correctly', () => {
    const service: ResizeService = TestBed.get(ResizeService);
    const boundingBox = new Rectangle(new Color(0, 0, 0, 0), Color.BLACK, 2, StrokeType.Outline, new Point(110, 110), 100, 100);
    const insideRectangle = new Rectangle(new Color(0, 0, 0, 0), Color.BLACK, 2, StrokeType.Outline, new Point(155, 155), 10, 10);
    const primitives: SVGPrimitive[] = [];
    primitives.push(insideRectangle);
    service.beginResize(boundingBox, primitives, HandleType.Right);
    expect(service.getTranslation()).toEqual(new Point(0, 0));
    // tslint:disable-next-line: no-string-literal
    expect(service['initialBoundingBox']).toEqual(boundingBox);
    // tslint:disable-next-line: no-string-literal
    expect(service['handleType']).toEqual(HandleType.Right);
  });

  it('should get temporary primitives correctly', () => {
    const service: ResizeService = TestBed.get(ResizeService);
    const tempPrim: SVGPrimitive = new Rectangle(Color.WHITE, Color.BLACK, 2, StrokeType.Outline, new Point(0, 0));
    // tslint:disable-next-line: no-string-literal
    service['resizeSelection'].push(tempPrim);
    expect(service.getTemporaryPrimitives()).toContain(tempPrim);
  });

  it('should reset values correctly', () => {
    const service: ResizeService = TestBed.get(ResizeService);
    const initialBoundingBox2 = new Rectangle(Color.WHITE, Color.BLACK, 2, StrokeType.Outline, new Point(0, 0));
    service.resetResizeValues();
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(1);
    // tslint:disable-next-line: no-string-literal
    expect(service['initialBoundingBox']).toEqual(initialBoundingBox2);
    expect(service.getTranslation()).toEqual(new Point(0, 0));
  });

  it('should calculate new bounding box corners and scales correctly with the RIGHT handle', () => {
    const service: ResizeService = TestBed.get(ResizeService);
    const initialPositionR = new Point(20, 15);

    // Mouvement en x seulement
    // BoundingBox 10x10 de (10, 10) à (20, 20)
    const initialBoundingBox = new Rectangle(Color.WHITE, Color.BLACK, 2, StrokeType.Outline, new Point(0, 0));
    let bBoxTLCorner = new Point(10, 10);
    let bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);
    // tslint:disable-next-line: no-string-literal
    service['initialBoundingBox'] = initialBoundingBox;

    // Vers la droite
    const newPositionR = new Point(30, 15);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionR, initialPositionR),
                                    HandleType.Right, false, false);
    expect(service.getScaleFactorX()).toEqual(2);
    expect(service.getScaleFactorY()).toEqual(1);

    // Vers la gauche scale factor positif
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionRL = new Point(15, 15);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionRL, initialPositionR),
                                    HandleType.Right, false, false);
    expect(service.getScaleFactorX()).toEqual(0.5);
    expect(service.getScaleFactorY()).toEqual(1);

    // Vers la gauche scale factor négatif
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionRLN = new Point(5, 15);

    service.calculateNewScaleFactors(Point.substractPoints(newPositionRLN, initialPositionR),
                                    HandleType.Right, false, false);
    expect(service.getScaleFactorX()).toEqual(-0.5);
    expect(service.getScaleFactorY()).toEqual(1);

    // Mouvement nul
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);
    service.calculateNewScaleFactors(Point.substractPoints(initialPositionR, initialPositionR),
                                    HandleType.Right, false, false);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(1);

    // Avec symétrie
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionRS = new Point(25, 15);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionRS, initialPositionR),
                                    HandleType.Right, false, true);
    expect(service.getScaleFactorX()).toEqual(2);
    expect(service.getScaleFactorY()).toEqual(1);

    // Avec symétrie et scale factors négatifs
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionRSN = new Point(5, 15);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionRSN, initialPositionR),
                                    HandleType.Right, false, true);
    expect(service.getScaleFactorX()).toEqual(-2);
    expect(service.getScaleFactorY()).toEqual(1);
  });

  it('should calculate new bounding box corners and scales correctly with the LEFT handle', () => {
    const service: ResizeService = TestBed.get(ResizeService);
    const initialPositionL = new Point(10, 15);

    // Mouvement en x seulement
    // BoundingBox 10x10 de (10, 10) à (20, 20)
    const initialBoundingBox = new Rectangle(Color.WHITE, Color.BLACK, 2, StrokeType.Outline, new Point(0, 0));
    let bBoxTLCorner = new Point(10, 10);
    let bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);
    // tslint:disable-next-line: no-string-literal
    service['initialBoundingBox'] = initialBoundingBox;

    // Vers la droite scale factor positif
    const newPositionLR = new Point(15, 15);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionLR, initialPositionL),
                                    HandleType.Left, false, false);
    expect(service.getScaleFactorX()).toEqual(0.5);
    expect(service.getScaleFactorY()).toEqual(1);

    // Vers la droite scale factor négatif
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionLRN = new Point(25, 15);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionLRN, initialPositionL),
                                    HandleType.Left, false, false);
    expect(service.getScaleFactorX()).toEqual(-0.5);
    expect(service.getScaleFactorY()).toEqual(1);

    // Vers la gauche
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionLL = new Point(5, 15);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionLL, initialPositionL),
                                    HandleType.Left, false, false);
    expect(service.getScaleFactorX()).toEqual(1.5);
    expect(service.getScaleFactorY()).toEqual(1);

    // Mouvement nul
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);
    service.calculateNewScaleFactors(Point.substractPoints(initialPositionL, initialPositionL),
                                    HandleType.Left, false, false);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(1);

    // Avec symétrie
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionLS = new Point(5, 15);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionLS, initialPositionL),
                                    HandleType.Left, false, true);
    expect(service.getScaleFactorX()).toEqual(2);
    expect(service.getScaleFactorY()).toEqual(1);

    // Avec symétrie et scale factors négatifs
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionRSN = new Point(25, 15);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionRSN, initialPositionL),
                                    HandleType.Left, false, true);
    expect(service.getScaleFactorX()).toEqual(-2);
    expect(service.getScaleFactorY()).toEqual(1);
  });

  it('should calculate new bounding box corners and scales correctly with the TOP handle', () => {
    const service: ResizeService = TestBed.get(ResizeService);
    const initialPositionT = new Point(15, 10);

    // Mouvement en y seulement
    // BoundingBox 10x10 de (10, 10) à (20, 20)
    const initialBoundingBox = new Rectangle(Color.WHITE, Color.BLACK, 2, StrokeType.Outline, new Point(0, 0));
    let bBoxTLCorner = new Point(10, 10);
    let bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);
    // tslint:disable-next-line: no-string-literal
    service['initialBoundingBox'] = initialBoundingBox;

    // Vers le haut
    const newPositionTT = new Point(15, 5);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTT, initialPositionT),
                                    HandleType.Top, false, false);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(1.5);

    // Vers le bas scale factor positif
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionTD = new Point(15, 15);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTD, initialPositionT),
                                    HandleType.Top, false, false);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(0.5);

    // Vers le bas scale factor négatif
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionTDN = new Point(15, 25);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTDN, initialPositionT),
                                    HandleType.Top, false, false);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(-0.5);

    // Mouvement nul
    bBoxTLCorner = new Point(10, 10);
    bBoxTLCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    service.calculateNewScaleFactors(Point.substractPoints(initialPositionT, initialPositionT),
                                    HandleType.Top, false, false);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(1);

    // Avec symétrie
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionTS = new Point(15, 5);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTS, initialPositionT),
                                    HandleType.Top, false, true);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(2);

    // Avec symétrie et scale factors négatifs
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionTSN = new Point(15, 25);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTSN, initialPositionT),
                                    HandleType.Top, false, true);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(-2);
  });

  it('should calculate new bounding box corners and scales correctly with the BOTTOM handle', () => {
    const service: ResizeService = TestBed.get(ResizeService);
    const initialPositionB = new Point(15, 20);

    // Mouvement en y seulement
    // BoundingBox 10x10 de (10, 10) à (20, 20)
    const initialBoundingBox = new Rectangle(Color.WHITE, Color.BLACK, 2, StrokeType.Outline, new Point(0, 0));
    let bBoxTLCorner = new Point(10, 10);
    let bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);
    // tslint:disable-next-line: no-string-literal
    service['initialBoundingBox'] = initialBoundingBox;

    // Vers le bas
    const newPositionBB = new Point(15, 25);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionBB, initialPositionB),
                                    HandleType.Bottom, false, false);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(1.5);

    // Vers le haut scale factor positif
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionBT = new Point(15, 15);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionBT, initialPositionB),
                                    HandleType.Bottom, false, false);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(0.5);

    // Vers le haut scale factor négatif
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionBTN = new Point(15, 5);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionBTN, initialPositionB),
                                    HandleType.Bottom, false, false);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(-0.5);

    // Mouvement nul
    bBoxTLCorner = new Point(10, 10);
    bBoxTLCorner = new Point(20, 10);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);
    service.calculateNewScaleFactors(Point.substractPoints(initialPositionB, initialPositionB),
                                    HandleType.Bottom, false, false);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(1);

    // Avec symétrie
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionTS = new Point(15, 25);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTS, initialPositionB),
                                    HandleType.Bottom, false, true);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(2);

    // Avec symétrie et scale factors négatifs
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionTSN = new Point(15, 5);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTSN, initialPositionB),
                                    HandleType.Bottom, false, true);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(-2);
  });

  it('should calculate new bounding box corners and scales correctly with the TOPLEFT handle with Y movements only', () => {
    const service: ResizeService = TestBed.get(ResizeService);
    const initialPositionTL = new Point(10, 10);

    // Mouvement en x et en y possibles
    // BoundingBox 10x10 de (10, 10) à (20, 20)
    const initialBoundingBox = new Rectangle(Color.WHITE, Color.BLACK, 2, StrokeType.Outline, new Point(0, 0));
    let bBoxTLCorner = new Point(10, 10);
    let bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);
    // tslint:disable-next-line: no-string-literal
    service['initialBoundingBox'] = initialBoundingBox;

    // Vers le haut seulement
    const newPositionTLT = new Point(10, 5);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTLT, initialPositionTL),
                                    HandleType.TopLeft, false, false);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(1.5);

    // Vers le bas seulement scale factor positif
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionTLB = new Point(10, 15);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTLB, initialPositionTL),
                                    HandleType.TopLeft, false, false);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(0.5);

    // Vers le bas seulement scale factor négatif
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionTLBN = new Point(10, 25);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTLBN, initialPositionTL),
                                    HandleType.TopLeft, false, false);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(-0.5);

    // Mouvement nul
    bBoxTLCorner = new Point(10, 10);
    bBoxTLCorner = new Point(20, 10);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);
    service.calculateNewScaleFactors(Point.substractPoints(initialPositionTL, initialPositionTL),
                                    HandleType.TopLeft, false, false);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(1);

    // Avec symétrie
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionTLS = new Point(10, 5);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTLS, initialPositionTL),
                                    HandleType.TopLeft, false, true);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(2);

    // Avec symétrie et scale factors négatifs
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionTSN = new Point(10, 25);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTSN, initialPositionTL),
                                    HandleType.TopLeft, false, true);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(-2);
  });

  it('should calculate new bounding box corners and scales correctly with the TOPLEFT handle with X movements only', () => {
    const service: ResizeService = TestBed.get(ResizeService);
    const initialPositionTL = new Point(10, 10);

    // Mouvement en x et en y possibles
    // BoundingBox 10x10 de (10, 10) à (20, 20)
    const initialBoundingBox = new Rectangle(Color.WHITE, Color.BLACK, 2, StrokeType.Outline, new Point(0, 0));
    let bBoxTLCorner = new Point(10, 10);
    let bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);
    // tslint:disable-next-line: no-string-literal
    service['initialBoundingBox'] = initialBoundingBox;

    // Vers la droite scale factor positif
    const newPositionTLR = new Point(15, 10);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTLR, initialPositionTL),
                                    HandleType.TopLeft, false, false);
    expect(service.getScaleFactorX()).toEqual(0.5);
    expect(service.getScaleFactorY()).toEqual(1);

    // Vers la droite scale factor négatif
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionTLRN = new Point(25, 10);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTLRN, initialPositionTL),
                                    HandleType.TopLeft, false, false);
    expect(service.getScaleFactorX()).toEqual(-0.5);
    expect(service.getScaleFactorY()).toEqual(1);

    // Vers la gauche
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionTLL = new Point(5, 10);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTLL, initialPositionTL),
                                    HandleType.TopLeft, false, false);
    expect(service.getScaleFactorX()).toEqual(1.5);
    expect(service.getScaleFactorY()).toEqual(1);
  });

  it('should calculate new bounding box corners and scales correctly with the TOPLEFT handle with combined movement', () => {
    const service: ResizeService = TestBed.get(ResizeService);
    const initialPositionTL = new Point(10, 10);

    // Mouvement en x et en y possibles
    // BoundingBox 10x10 de (10, 10) à (20, 20)
    const initialBoundingBox = new Rectangle(Color.WHITE, Color.BLACK, 2, StrokeType.Outline, new Point(0, 0));
    let bBoxTLCorner = new Point(10, 10);
    let bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);
    // tslint:disable-next-line: no-string-literal
    service['initialBoundingBox'] = initialBoundingBox;

    // Vers la gauche et le haut
    const newPositionTLTL = new Point(5, 5);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTLTL, initialPositionTL),
                                    HandleType.TopLeft, false, false);
    expect(service.getScaleFactorX()).toEqual(1.5);
    expect(service.getScaleFactorY()).toEqual(1.5);

    // Vers la gauche et le bas scale négatif en y
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionTLBL = new Point(5, 25);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTLBL, initialPositionTL),
                                    HandleType.TopLeft, false, false);
    expect(service.getScaleFactorX()).toEqual(1.5);
    expect(service.getScaleFactorY()).toEqual(-0.5);

    // Vers la droite et le bas scale factor positif
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionTLBR = new Point(15, 15);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTLBR, initialPositionTL),
                                    HandleType.TopLeft, false, false);
    expect(service.getScaleFactorX()).toEqual(0.5);
    expect(service.getScaleFactorY()).toEqual(0.5);

    // Vers la droite et le bas scale factors négatifs
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionTLBRN = new Point(25, 25);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTLBRN, initialPositionTL),
                                    HandleType.TopLeft, false, false);
    expect(service.getScaleFactorX()).toEqual(-0.5);
    expect(service.getScaleFactorY()).toEqual(-0.5);

    // Avec symétrie
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionTLS = new Point(5, 5);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTLS, initialPositionTL),
                                    HandleType.TopLeft, false, true);
    expect(service.getScaleFactorX()).toEqual(2);
    expect(service.getScaleFactorY()).toEqual(2);

    // Avec symétrie et scale factors négatifs
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionTLSN = new Point(25, 25);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTLSN, initialPositionTL),
                                    HandleType.TopLeft, false, true);
    expect(service.getScaleFactorX()).toEqual(-2);
    expect(service.getScaleFactorY()).toEqual(-2);
  });

  it('should calculate new bounding box corners and scales correctly with the TOPRIGHT handle with Y movements only', () => {
    const service: ResizeService = TestBed.get(ResizeService);
    const initialPositionTR = new Point(20, 10);

    // Mouvement en x et en y possibles
    // BoundingBox 10x10 de (10, 10) à (20, 20)
    const initialBoundingBox = new Rectangle(Color.WHITE, Color.BLACK, 2, StrokeType.Outline, new Point(0, 0));
    let bBoxTLCorner = new Point(10, 10);
    let bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);
    // tslint:disable-next-line: no-string-literal
    service['initialBoundingBox'] = initialBoundingBox;

    // Vers le haut seulement
    const newPositionTRT = new Point(20, 5);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTRT, initialPositionTR),
                                    HandleType.TopRight, false, false);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(1.5);

    // Vers le bas seulement scale factor positif
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionTRB = new Point(20, 15);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTRB, initialPositionTR),
                                    HandleType.TopRight, false, false);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(0.5);

    // Vers le bas seulement scale factor négatif
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionTRBN = new Point(20, 25);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTRBN, initialPositionTR),
                                    HandleType.TopRight, false, false);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(-0.5);

    // Mouvement nul
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);
    service.calculateNewScaleFactors(Point.substractPoints(initialPositionTR, initialPositionTR),
                                    HandleType.TopRight, false, false);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(1);
  });

  it('should calculate new bounding box corners and scales correctly with the TOPRIGHT handle with X movements only', () => {
    const service: ResizeService = TestBed.get(ResizeService);
    const initialPositionTR = new Point(20, 10);

    // Mouvement en x et en y possibles
    // BoundingBox 10x10 de (10, 10) à (20, 20)
    const initialBoundingBox = new Rectangle(Color.WHITE, Color.BLACK, 2, StrokeType.Outline, new Point(0, 0));
    let bBoxTLCorner = new Point(10, 10);
    let bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);
    // tslint:disable-next-line: no-string-literal
    service['initialBoundingBox'] = initialBoundingBox;

    // Vers la droite
    const newPositionTRR = new Point(25, 10);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTRR, initialPositionTR),
                                    HandleType.TopRight, false, false);
    expect(service.getScaleFactorX()).toEqual(1.5);
    expect(service.getScaleFactorY()).toEqual(1);

    // Vers la gauche scale factor positif
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionTRL = new Point(15, 10);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTRL, initialPositionTR),
                                    HandleType.TopRight, false, false);
    expect(service.getScaleFactorX()).toEqual(0.5);
    expect(service.getScaleFactorY()).toEqual(1);

    // Vers la gauche scale factor négatif
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionTRLN = new Point(5, 10);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTRLN, initialPositionTR),
                                    HandleType.TopRight, false, false);
    expect(service.getScaleFactorX()).toEqual(-0.5);
    expect(service.getScaleFactorY()).toEqual(1);
  });

  it('should calculate new bounding box corners and scales correctly with the TOPRIGHT handle with combined movement', () => {
    const service: ResizeService = TestBed.get(ResizeService);
    const initialPositionTR = new Point(20, 10);

    // Mouvement en x et en y possibles
    // BoundingBox 10x10 de (10, 10) à (20, 20)
    const initialBoundingBox = new Rectangle(Color.WHITE, Color.BLACK, 2, StrokeType.Outline, new Point(0, 0));
    let bBoxTLCorner = new Point(10, 10);
    let bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);
    // tslint:disable-next-line: no-string-literal
    service['initialBoundingBox'] = initialBoundingBox;

    // Vers la droite et le haut
    const newPositionTRTR = new Point(25, 5);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTRTR, initialPositionTR),
                                    HandleType.TopRight, false, false);
    expect(service.getScaleFactorX()).toEqual(1.5);
    expect(service.getScaleFactorY()).toEqual(1.5);

    // Vers la gauche et le haut scale factor négatif en x
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionTRTL = new Point(5, 5);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTRTL, initialPositionTR),
                                    HandleType.TopRight, false, false);
    expect(service.getScaleFactorX()).toEqual(-0.5);
    expect(service.getScaleFactorY()).toEqual(1.5);

    // Vers la droite et le bas scale factor négatif en y
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionTRBR = new Point(15, 25);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTRBR, initialPositionTR),
                                    HandleType.TopRight, false, false);
    expect(service.getScaleFactorX()).toEqual(0.5);
    expect(service.getScaleFactorY()).toEqual(-0.5);

    // Vers la gauche et le bas scale factors négatifs
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionTRBLN = new Point(5, 25);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTRBLN, initialPositionTR),
                                    HandleType.TopRight, false, false);
    expect(service.getScaleFactorX()).toEqual(-0.5);
    expect(service.getScaleFactorY()).toEqual(-0.5);

    // Avec symétrie
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionTRS = new Point(25, 5);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTRS, initialPositionTR),
                                    HandleType.TopRight, false, true);
    expect(service.getScaleFactorX()).toEqual(2);
    expect(service.getScaleFactorY()).toEqual(2);

    // Avec symétrie et scale factors négatifs
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionTRSN = new Point(5, 25);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionTRSN, initialPositionTR),
                                    HandleType.TopRight, false, true);
    expect(service.getScaleFactorX()).toEqual(-2);
    expect(service.getScaleFactorY()).toEqual(-2);
  });

  it('should calculate new bounding box corners and scales correctly with the BOTTOMLEFT handle with Y movements only', () => {
    const service: ResizeService = TestBed.get(ResizeService);
    const initialPositionBL = new Point(10, 20);

    // Mouvement en x et en y possibles
    // BoundingBox 10x10 de (10, 10) à (20, 20)
    const initialBoundingBox = new Rectangle(Color.WHITE, Color.BLACK, 2, StrokeType.Outline, new Point(0, 0));
    let bBoxTLCorner = new Point(10, 10);
    let bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);
    // tslint:disable-next-line: no-string-literal
    service['initialBoundingBox'] = initialBoundingBox;

    // Vers le bas seulement
    const newPositionBLB = new Point(10, 25);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionBLB, initialPositionBL),
                                    HandleType.BottomLeft, false, false);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(1.5);

    // Vers le haut seulement scale factor positif
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionBLT = new Point(10, 15);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionBLT, initialPositionBL),
                                    HandleType.BottomLeft, false, false);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(0.5);

    // Vers le haut seulement scale factor négatif
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionBLTN = new Point(10, 5);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionBLTN, initialPositionBL),
                                    HandleType.BottomLeft, false, false);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(-0.5);

    // Mouvement nul
    bBoxTLCorner = new Point(10, 10);
    bBoxTLCorner = new Point(20, 10);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);
    service.calculateNewScaleFactors(Point.substractPoints(initialPositionBL, initialPositionBL),
                                    HandleType.BottomLeft, false, false);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(1);
  });

  it('should calculate new bounding box corners and scales correctly with the BOTTOMLEFT handle with X movements only', () => {
    const service: ResizeService = TestBed.get(ResizeService);
    const initialPositionBL = new Point(10, 20);

    // Mouvement en x et en y possibles
    // BoundingBox 10x10 de (10, 10) à (20, 20)
    const initialBoundingBox = new Rectangle(Color.WHITE, Color.BLACK, 2, StrokeType.Outline, new Point(0, 0));
    let bBoxTLCorner = new Point(10, 10);
    let bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);
    // tslint:disable-next-line: no-string-literal
    service['initialBoundingBox'] = initialBoundingBox;

    // Vers la gauche
    const newPositionBLL = new Point(5, 20);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionBLL, initialPositionBL),
                                    HandleType.BottomLeft, false, false);
    expect(service.getScaleFactorX()).toEqual(1.5);
    expect(service.getScaleFactorY()).toEqual(1);

    // Vers la droite scale factor positif
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionBLR = new Point(15, 20);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionBLR, initialPositionBL),
                                    HandleType.BottomLeft, false, false);
    expect(service.getScaleFactorX()).toEqual(0.5);
    expect(service.getScaleFactorY()).toEqual(1);

    // Vers la droite scale factor négatif
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionBLRN = new Point(25, 20);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionBLRN, initialPositionBL),
                                    HandleType.BottomLeft, false, false);
    expect(service.getScaleFactorX()).toEqual(-0.5);
    expect(service.getScaleFactorY()).toEqual(1);
  });

  it('should calculate new bounding box corners and scales correctly with the BOTTOMLEFT handle with combined movement', () => {
    const service: ResizeService = TestBed.get(ResizeService);
    const initialPositionBL = new Point(10, 20);

    // Mouvement en x et en y possibles
    // BoundingBox 10x10 de (10, 10) à (20, 20)
    const initialBoundingBox = new Rectangle(Color.WHITE, Color.BLACK, 2, StrokeType.Outline, new Point(0, 0));
    let bBoxTLCorner = new Point(10, 10);
    let bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);
    // tslint:disable-next-line: no-string-literal
    service['initialBoundingBox'] = initialBoundingBox;

    // Vers le bas et la gauche
    const newPositionBLBL = new Point(5, 25);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionBLBL, initialPositionBL),
                                    HandleType.BottomLeft, false, false);
    expect(service.getScaleFactorX()).toEqual(1.5);
    expect(service.getScaleFactorY()).toEqual(1.5);

    // Vers la droite et le haut scale factor négatif en x et en y
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionBLTRN = new Point(25, 5);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionBLTRN, initialPositionBL),
                                    HandleType.BottomLeft, false, false);
    expect(service.getScaleFactorX()).toEqual(-0.5);
    expect(service.getScaleFactorY()).toEqual(-0.5);

    // Vers la droite et le haut scale factor négatif en y
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionBLTL = new Point(15, 5);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionBLTL, initialPositionBL),
                                    HandleType.BottomLeft, false, false);
    expect(service.getScaleFactorX()).toEqual(0.5);
    expect(service.getScaleFactorY()).toEqual(-0.5);

    // Vers la droite et le bas scale factor négatif en x
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionBLBR = new Point(25, 25);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionBLBR, initialPositionBL),
                                    HandleType.BottomLeft, false, false);
    expect(service.getScaleFactorX()).toEqual(-0.5);
    expect(service.getScaleFactorY()).toEqual(1.5);

    // Avec symétrie
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionBLS = new Point(5, 25);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionBLS, initialPositionBL),
                                    HandleType.BottomLeft, false, true);
    expect(service.getScaleFactorX()).toEqual(2);
    expect(service.getScaleFactorY()).toEqual(2);

    // Avec symétrie et scale factors négatifs
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionBLSN = new Point(25, 5);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionBLSN, initialPositionBL),
                                    HandleType.BottomLeft, false, true);
    expect(service.getScaleFactorX()).toEqual(-2);
    expect(service.getScaleFactorY()).toEqual(-2);
  });

  it('should calculate new bounding box corners and scales correctly with the BOTTOMRIGHT handle with Y movements only', () => {
    const service: ResizeService = TestBed.get(ResizeService);
    const initialPositionBR = new Point(20, 20);

    // Mouvement en x et en y possibles
    // BoundingBox 10x10 de (10, 10) à (20, 20)
    const initialBoundingBox = new Rectangle(Color.WHITE, Color.BLACK, 2, StrokeType.Outline, new Point(0, 0));
    let bBoxTLCorner = new Point(10, 10);
    let bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);
    // tslint:disable-next-line: no-string-literal
    service['initialBoundingBox'] = initialBoundingBox;

    // Vers le bas seulement
    const newPositionBRB = new Point(20, 25);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionBRB, initialPositionBR),
                                    HandleType.BottomRight, false, false);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(1.5);

    // Vers le haut seulement scale factor positif
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionBRT = new Point(20, 15);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionBRT, initialPositionBR),
                                    HandleType.BottomRight, false, false);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(0.5);

    // Vers le haut seulement scale factor négatif
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionBRTN = new Point(20, 5);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionBRTN, initialPositionBR),
                                    HandleType.BottomRight, false, false);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(-0.5);

    // Mouvement nul
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);
    service.calculateNewScaleFactors(Point.substractPoints(initialPositionBR, initialPositionBR),
                                    HandleType.BottomRight, false, false);
    expect(service.getScaleFactorX()).toEqual(1);
    expect(service.getScaleFactorY()).toEqual(1);
  });

  it('should calculate new bounding box corners and scales correctly with the BOTTOMRIGHT handle with X movements only', () => {
    const service: ResizeService = TestBed.get(ResizeService);
    const initialPositionBR = new Point(20, 20);

    // Mouvement en x et en y possibles
    // BoundingBox 10x10 de (10, 10) à (20, 20)
    const initialBoundingBox = new Rectangle(Color.WHITE, Color.BLACK, 2, StrokeType.Outline, new Point(0, 0));
    let bBoxTLCorner = new Point(10, 10);
    let bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);
    // tslint:disable-next-line: no-string-literal
    service['initialBoundingBox'] = initialBoundingBox;

    // Vers la droite
    const newPositionBRR = new Point(25, 20);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionBRR, initialPositionBR),
                                    HandleType.BottomRight, false, false);
    expect(service.getScaleFactorX()).toEqual(1.5);
    expect(service.getScaleFactorY()).toEqual(1);

    // Vers la gauche scale factor positif
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionBRL = new Point(15, 20);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionBRL, initialPositionBR),
                                    HandleType.BottomRight, false, false);
    expect(service.getScaleFactorX()).toEqual(0.5);
    expect(service.getScaleFactorY()).toEqual(1);

    // Vers la gauche scale factor négatif
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionBRLN = new Point(5, 20);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionBRLN, initialPositionBR),
                                    HandleType.BottomRight, false, false);
    expect(service.getScaleFactorX()).toEqual(-0.5);
    expect(service.getScaleFactorY()).toEqual(1);
  });

  it('should calculate new bounding box corners and scales correctly with the BOTTOMRIGHT handle with combined movement', () => {
    const service: ResizeService = TestBed.get(ResizeService);
    const initialPositionBR = new Point(20, 20);

    // Mouvement en x et en y possibles
    // BoundingBox 10x10 de (10, 10) à (20, 20)
    const initialBoundingBox = new Rectangle(Color.WHITE, Color.BLACK, 2, StrokeType.Outline, new Point(0, 0));
    let bBoxTLCorner = new Point(10, 10);
    let bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);
    // tslint:disable-next-line: no-string-literal
    service['initialBoundingBox'] = initialBoundingBox;

    // Vers le bas et la droite
    const newPositionBRBR = new Point(25, 25);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionBRBR, initialPositionBR),
                                    HandleType.BottomRight, false, false);
    expect(service.getScaleFactorX()).toEqual(1.5);
    expect(service.getScaleFactorY()).toEqual(1.5);

    // Vers la gauche et le haut scale factor négatif en x et en y
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionBRTLN = new Point(5, 5);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionBRTLN, initialPositionBR),
                                    HandleType.BottomRight, false, false);
    expect(service.getScaleFactorX()).toEqual(-0.5);
    expect(service.getScaleFactorY()).toEqual(-0.5);

    // Vers la droite et le haut scale factor négatif en y
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionBRTR = new Point(15, 5);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionBRTR, initialPositionBR),
                                    HandleType.BottomRight, false, false);
    expect(service.getScaleFactorX()).toEqual(0.5);
    expect(service.getScaleFactorY()).toEqual(-0.5);

    // Vers la gauche et le bas scale factor négatif en x
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionBRBL = new Point(5, 25);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionBRBL, initialPositionBR),
                                    HandleType.BottomRight, false, false);
    expect(service.getScaleFactorX()).toEqual(-0.5);
    expect(service.getScaleFactorY()).toEqual(1.5);

    // Avec symétrie
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionBRS = new Point(25, 25);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionBRS, initialPositionBR),
                                    HandleType.BottomRight, false, true);
    expect(service.getScaleFactorX()).toEqual(2);
    expect(service.getScaleFactorY()).toEqual(2);

    // Avec symétrie et scale factors négatifs
    bBoxTLCorner = new Point(10, 10);
    bBoxBRCorner = new Point(20, 20);
    initialBoundingBox.resize(bBoxTLCorner, bBoxBRCorner, false, true);

    const newPositionBRSN = new Point(5, 5);
    service.calculateNewScaleFactors(Point.substractPoints(newPositionBRSN, initialPositionBR),
                                    HandleType.BottomRight, false, true);
    expect(service.getScaleFactorX()).toEqual(-2);
    expect(service.getScaleFactorY()).toEqual(-2);
  });
});
