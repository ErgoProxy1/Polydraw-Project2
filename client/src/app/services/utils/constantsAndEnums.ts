import { Color } from './color';
import { Point } from './point';

export enum StrokeType {
  Full,
  Outline,
  FullWithOutline,
}

export enum Texture {
  Basic,
  Degraded,
  Grayed,
  Light,
  Frothy,
}

export enum Pattern {
  DottedLine,
  FullLine,
  SpacedLine1,
  SpacedLine2,
  SpacedLine3,
  SpacedLine4,
}

export enum LineCap {
  Butt,
  Round,
  Square,
}

export enum LineJoin {
  Arcs,
  Bevel,
  Miter,
  MiterClip,
  Point,
  Round,
  BezierRound,
}

export enum ToolType {
  RectangleTool,
  PaintBrushTool,
  Pencil,
  Pen,
  Line,
  ColorApplicator,
  EllipseTool,
  PolygonTool,
  SelectorTool,
  StampTool,
  EyeDropper,
  GridTool,
  Eraser,
  TextTool,
  None,
}

export enum PrimitiveType {
  Abstract,
  Rectangle,
  Paint,
  Pencil,
  Line,
  Stamp,
  Ellipse,
  Polygon,
  Perimeter,
  Pen,
  Text,
}

export enum KeyboardShortcutType {
  CreateDrawing,
  SaveDrawing,
  OpenGallery,
  ExportDrawing,

  Cut,
  Copy,
  Paste,
  Duplicate,
  Delete,
  SelectAll,

  Undo,
  Redo,

  Pencil, // crayon
  PaintBrush, // pinceau
  FountainPen, // plume
  Pen, // stylo
  SprayPaint, // Aérosol
  Rectangle,
  Ellipse,
  Polygon,
  Line,
  Text,
  ColorApplicator, // Applicateur de couleur
  PaintBucket, // Seau de peinture
  Eraser,
  Dropper, // Pipette
  Select,

  Grid,
  Magnet,
  ZoomInGrid,
  ZoomOutGrid,

  None,
}

export enum MouseEventType {
  MouseUpLeft,
  MouseUpRight,
  MouseDownLeft,
  MouseDownRight,
  MouseClickLeft,
  MouseClickRight,
  MouseDblClick,
  MouseMove,
  MouseLeave,
  MouseOver,
  InvalidEvent,
}

export enum KeyboardEventType {
  ShiftUp,
  ShiftDown,
  AltUp,
  AltDown,
  AltShiftDown,
  AltShiftUp,
  EscapeDown,
  BackspaceDown,
  KeyUp,
  KeyDown,
  EnterDown,
  SpaceDown,
  InvalidEvent,
}

// ----- CONSTANTES ----- //

export const DEFAULT_LINE_STROKE_WIDTH = 2;
export const DEFAULT_LINE_ROUNDING = 20;
export const DEFAULT_PEN_STROKE_WIDTH = 14;
export const ROUNDING_FACTOR = 0.1;
export const MAX_LINE_ROUNDING = 50;
export const CIRCLE_RADIUS_FACTOR = 1.5;
export const DEFAULT_STROKE_WIDTH = 5;
export const MIN_STROKE_WIDTH = 1;
export const DEFAULT_PEN_MIN_SLIDER_STROKE_WIDTH = 2;
export const MIN_OF_MIN_PEN_STROKE_WIDTH = 1;
export const MAX_OF_MIN_PEN_STROKE_WIDTH = 10;
export const MIN_OF_MAX_PEN_STROKE_WIDTH = 1;
export const MAX_OF_MAX_PEN_STROKE_WIDTH = 50;
export const PEN_SUB_PATH_LENGTH = 1;
export const SECOND_TO_MILI_SECOND = 1000;
export const CURSOR_SPEED_FACTOR = 400;
export const PEN_CURSOR_SPEED_INITIAL_POINT_RANK = 2;
export const MAX_STROKE_WIDTH = 50;
export const SHIFT_KEY_CODE = '16';
export const ALT_KEY_CODE = '18';
export const ESCAPE_KEY_CODE = '17';
export const BACKSPACE_KEY_CODE = '8';
export const SPACE_KEY_CODE = '32';
export const ENTER_KEY_CODE = '13';
export const DELETE_KEY_CODE = '46';

// ------- CONSTANTES DE PALETTE ----------//
export interface PaletteChoiceInfo {
  positionX: number;
  positionY: number;
  color: string;
}

export const PALETTE_CHOICES: PaletteChoiceInfo[] = [
  {positionX: 0, positionY: 0, color: '#000000'},
  {positionX: 50, positionY: 0, color: '#FF0000'},
  {positionX: 100, positionY: 0, color: '#FFA500'},
  {positionX: 150, positionY: 0, color: '#CDFF00'},
  {positionX: 200, positionY: 0, color: '#32FF00'},
  {positionX: 250, positionY: 0, color: '#00FF80'},
  {positionX: 0, positionY: 50, color: '#474747'},
  {positionX: 50, positionY: 50, color: '#800000'},
  {positionX: 100, positionY: 50, color: '#804C00'},
  {positionX: 150, positionY: 50, color: '#657F02'},
  {positionX: 200, positionY: 50, color: '#1A7E00'},
  {positionX: 250, positionY: 50, color: '#007F32'},
  {positionX: 0, positionY: 100, color: '#A8A8A8'},
  {positionX: 50, positionY: 100, color: '#01FFFF'},
  {positionX: 100, positionY: 100, color: '#0064FF'},
  {positionX: 150, positionY: 100, color: '#3300FF'},
  {positionX: 200, positionY: 100, color: '#CC00FF'},
  {positionX: 250, positionY: 100, color: '#FF0198'},
  {positionX: 0, positionY: 150, color: '#FFFFFF'},
  {positionX: 50, positionY: 150, color: '#017F7E'},
  {positionX: 100, positionY: 150, color: '#01327F'},
  {positionX: 150, positionY: 150, color: '#19007F'},
  {positionX: 200, positionY: 150, color: '#66007F'},
  {positionX: 250, positionY: 150, color: '#7F014B'},
];

export const PALETTE_CHOICES_RGB: Color[] = [
  new Color(0, 0, 0, 1),
  new Color(255, 0, 0, 1),
  new Color(255, 165, 0, 1),
  new Color(205, 255, 0, 1),
  new Color(50, 255, 0, 1),
  new Color(0, 255, 128, 1),
  new Color(71, 71, 71, 1),
  new Color(128, 0, 0, 1),
  new Color(128, 76, 0, 1),
  new Color(101, 127, 2, 1),
  new Color(26, 126, 0, 1),
  new Color(0, 127, 50, 1),
  new Color(168, 168, 168, 1),
  new Color(1, 255, 255, 1),
  new Color(0, 100, 155, 1),
  new Color(51, 0, 255, 1),
  new Color(204, 0, 255, 1),
  new Color(255, 1, 152, 1),
  new Color(255, 255, 255, 1),
  new Color(1, 127, 126, 1),
  new Color(1, 50, 127, 1),
  new Color(25, 0, 127, 1),
  new Color(102, 0, 127, 1),
  new Color(127, 1, 75, 1),
];

// ----- Constantes Polygone ----- //
export const POLYGON_NAMES: Map<number, string> = new Map([
  [3, '3(triangle)'],
  [4, '4(diamond)'],
  [5, '5(pentagon)'],
  [6, '6(hexagon)'],
  [7, '7(heptagon)'],
  [8, '8(octagon)'],
  [9, '9(nonagon)'],
  [10, '10(decagon)'],
  [11, '11(hendecagon)'],
  [12, '12(dodecagon)'],
]);

export const SERVER_BASE_URL = 'http://localhost:3000/api';

export enum SavingType {
  SaveOnServer,
  SaveLocally,
}
export interface SavingTypeInterface  {
  id: SavingType;
  text: string;
}

export const SAVING_TYPE_CHOICES: SavingTypeInterface[] = [
  {id: SavingType.SaveOnServer, text: 'Save on Server'},
  {id: SavingType.SaveLocally, text: 'Save Locally'},
];

// ----- Constantes Grille ----- //
export const MAX_ALPHA = 1;
export const DEFAULT_GRID_ALPHA = 0.5;
export const MIN_GRID_ALPHA = 0.1;
export const MIN_GRID_SIZE = 10 ;
export const MAX_GRID_SIZE = 300 ;

// ----- Constantes Souris -----//
export const LEFT_MOUSE_BUTTON = 0;
export const RIGHT_MOUSE_BUTTON = 2;

// ----- Constantes Efface -----//
export const MIN_ERASER_SIZE = 25;
export const MAX_ERASER_SIZE = 50;
export const ERASER_FILL_COLOR: Color = new Color(255, 255, 255);
export const ERASER_STROKE_COLOR: Color = new Color(0, 0, 0);
export const HIGHLIGH_COLOR: Color = new Color(255, 0, 0);
export const HIGHLIGH_BACKUP_COLOR: Color = new Color(0, 255, 255);

// ----- Constantes pour le text -----//
export interface FontInfo {
  name: string;
  family: string;
}

export const FONTS: FontInfo[] = [
  {name: 'Arial', family: 'Arial, sans-serif'},
  {name: 'Bookman', family: 'Bookman, URW Bookman L, serif'},
  {name: 'Comic Sans', family: 'Comic Sans MS, Comic Sans, cursive'},
  {name: 'Courier', family: 'Courier New, monospace'},
  {name: 'Helvetica', family: 'Helvetica, sans-serif'},
  {name: 'Times New Roman', family: 'Times New Roman, sans-serif'},
  {name: 'Verdana', family: 'Verdana, sans-serif'},
];

export interface AlignInfo {
  name: string;
  value: string;
}
export const ALIGNS: AlignInfo[] = [
  {name: 'Left', value: 'start'},
  {name: 'Center', value: 'middle'},
  {name: 'Right', value: 'end'},
];

// ----- Constantes pour exporter le dessin -----//
export enum ExportType {
  BMP,
  JPG,
  PNG,
  SVG,
}
export interface ExportTypeInterface {
  readonly id: ExportType;
  readonly name: string;
}

export const EXPORT_TYPES: ExportTypeInterface[] = [
  {id: ExportType.BMP, name: '.bmp'},
  {id: ExportType.JPG, name: '.jpg'},
  {id: ExportType.PNG, name: '.png'},
  {id: ExportType.SVG, name: '.svg'},
];

// ----- Fin Constantes pour export le dessin -----//

export const PASTE_OFFSET: Point = new Point(50, 50);
export const ORIGIN: Point = new Point(0, 0);
// ----- Constantes de curseur ----- //
export const NO_CURSOR = 'none';
export const DEFAULT_CURSOR = 'default';
export const CROSSHAIR_CURSOR = 'crosshair';
export const POINTER_CURSOR = 'pointer';
export const TEXT_CURSOR = 'text';
