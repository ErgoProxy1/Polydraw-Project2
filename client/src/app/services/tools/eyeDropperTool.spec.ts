import { Ellipse } from '../svgPrimitives/ellipse/ellispe';
import { Line } from '../svgPrimitives/line/line';
import { Path } from '../svgPrimitives/path/path';
import { Polygon } from '../svgPrimitives/polygon/polygon';
import { Rectangle } from '../svgPrimitives/rectangle/rectangle';
import { Stamp } from '../svgPrimitives/stamp/stamp';
import { EyeDropperToolCommand } from '../toolCommands/eyeDropperCommand';
import { Color } from '../utils/color';
// tslint:disable-next-line
import { DEFAULT_LINE_ROUNDING, KeyboardEventType, LineCap, LineJoin, MouseEventType, Pattern, StrokeType, Texture } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { DefaultStamps } from '../utils/stampData';
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
        100, 135, new Point(50, 50), DefaultStamps[4], // Coeur
    );
    const line: Line = new Line(
        new Color(64, 64, 64, 0.5), 10, Pattern.FullLine, LineJoin.Arcs, LineCap.Butt, 10, DEFAULT_LINE_ROUNDING,
    );
    const path: Path = new Path(new Color(64, 64, 64, 0.5), 10, Texture.Basic);

    beforeEach(() => {
        tool = new EyeDropperTool();
    });

    it('Tool command is properly created', () => {
        expect(tool.mouseEvent(MouseEventType.MouseDownLeft, new Point(50, 50), rectangle)).toEqual([]);
        expect(tool.getCommand() as EyeDropperToolCommand).toEqual(new EyeDropperToolCommand(rectangle, true, rectangle.strokeColor));
    });

    it('Other event commands do nothing', () => {
        expect(tool.keyboardEvent(KeyboardEventType.KeyDown, 'a')).toEqual([]);
        expect(tool.mouseWheelEvent(1)).toEqual([]);
    });

    it('Command is properly set to ready', () => {
        expect(tool.isCommandReady()).toBe(false);
        tool.mouseEvent(MouseEventType.MouseDownLeft, new Point(50, 50), rectangle);
        expect(tool.isCommandReady()).toBe(true);
        tool.getCommand();
        expect(tool.isCommandReady()).toBe(false);
    });

    it('Tool properly distinguishes between fill or stroke', () => {
        expect(tool.determineFillOrStroke(new Point(75, 75), rectangle)).toEqual(rectangle.fillColor);
        expect(tool.determineFillOrStroke(new Point(75, 75), ellipse)).toEqual(ellipse.fillColor);
        polygon.resize(new Point(20, 20), new Point (80, 80), true);
        expect(tool.determineFillOrStroke(new Point(50, 50), polygon)).toEqual(polygon.fillColor);
        expect(tool.determineFillOrStroke(new Point(60, 60), stamp)).toEqual(DefaultStamps[4].color);
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
