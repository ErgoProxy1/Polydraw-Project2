import { Ellipse } from '../svgPrimitives/ellipse/ellipse';
import { Line } from '../svgPrimitives/line/line';
import { Path } from '../svgPrimitives/path/path';
import { Polygon } from '../svgPrimitives/polygon/polygon';
import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { Stamp } from '../svgPrimitives/stamp/stamp';
import { Color } from '../utils/color';
// tslint:disable-next-line
import { DEFAULT_LINE_ROUNDING, KeyboardEventType, LineCap, LineJoin, Pattern, PrimitiveType, StrokeType, Texture } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { DEFAULT_STAMPS } from '../utils/stampData';
import { EyeDropperTool } from './eyeDropperTool';

describe('EyeDropperTool', () => {
    let tool: EyeDropperTool;
    const rectangle: Rectangle = new Rectangle(
        new Color(64, 64, 64, 0.5), new Color(32, 32, 32, 0.5), 10, StrokeType.Full, new Point(50, 50), 50, 50,
    );
    const ellipse: Ellipse = new Ellipse(
        new Color(64, 64, 64, 0.5), new Color(32, 32, 32, 0.5), 10, StrokeType.Full, new Point(50, 50), 50, 50,
    );
    const polygon: Polygon = new Polygon(
        new Color(64, 64, 64, 0.5), new Color(32, 32, 32, 0.5), 10, StrokeType.Full, new Point(50, 50), 10, 8,
    );
    const stamp: Stamp = new Stamp(
        100, 135, new Point(50, 50), DEFAULT_STAMPS[4], // Coeur
    );
    const line: Line = new Line(
        new Color(64, 64, 64, 0.5), 10, Pattern.FullLine, LineJoin.Arcs, LineCap.Butt, 10, DEFAULT_LINE_ROUNDING,
    );
    const path: Path = new Path(new Color(64, 64, 64, 0.5), 10, PrimitiveType.Paint, Texture.Basic);

    beforeEach(() => {
        tool = new EyeDropperTool();
    });

    it('Other event commands do nothing', () => {
        tool.keyboardEvent(KeyboardEventType.InvalidEvent);
        expect(tool.getTemporaryPrimitives()).toEqual([]);
        tool.mouseWheelEvent(1);
        expect(tool.getTemporaryPrimitives()).toEqual([]);
    });

    it('Tool properly distinguishes between fill or stroke', () => {
        expect(tool.determineFillOrStroke(new Point(75, 75), rectangle)).toEqual(rectangle.fillColor);
        expect(tool.determineFillOrStroke(new Point(75, 75), ellipse)).toEqual(ellipse.fillColor);
        polygon.resize(new Point(20, 20), new Point (80, 80), true);
        expect(tool.determineFillOrStroke(new Point(50, 50), polygon)).toEqual(polygon.fillColor);
        expect(tool.determineFillOrStroke(new Point(60, 60), stamp)).toEqual(DEFAULT_STAMPS[4].color);
        expect(tool.determineFillOrStroke(new Point(0, 0), line)).toEqual(line.strokeColor);
        expect(tool.determineFillOrStroke(new Point(0, 0), path)).toEqual(path.strokeColor);
    });

    it('Rectangle colors are properly read', () => {
        let clicked: Point = new Point(75, 75);
        expect(tool.getColorRectangle(clicked, rectangle)).toEqual(rectangle.fillColor);

        clicked = new Point(51, 51);
        expect(tool.getColorRectangle(clicked, rectangle)).toEqual(rectangle.strokeColor);
    });

    it('Ellipse colors are properly read', () => {
        let clicked: Point = new Point(75, 75);
        expect(tool.getColorEllipse(clicked, ellipse)).toEqual(ellipse.fillColor);

        clicked = new Point(100, 51);
        expect(tool.getColorEllipse(clicked, ellipse)).toEqual(ellipse.strokeColor);
    });
});
