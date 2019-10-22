import { Color } from './color';

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

// ------- CONSTANTES DE PALETTE ----------//
export class PaletteChoiceInfo {
  positionX: number;
  positionY: number;
  color: string;
}

export const PaletteChoices: PaletteChoiceInfo[] = [
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

export const PaletteChoicesRGB: Color[] = [
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
// ------ FIN DES CONSTANTES DE PALETTE -----------//

export const POLYGON_NAMES: Map<number, string> = new Map([
  [3, '3(triangle)'],
  [4, '4(diamant)'],
  [5, '5(pentagone)'],
  [6, '6(hexagone)'],
  [7, '7(heptagone)'],
  [8, '8(octagone)'],
  [9, '9(nonagone)'],
  [10, '10(decagone)'],
  [11, '11(hendecagone)'],
  [12, '12(dodecagone)'],
]);

export enum ToolType {
  RectangleTool,
  PaintBrushTool,
  Pencil,
  Line,
  ColorApplicator,
  EllipseTool,
  PolygonTool,
  SelectorTool,
  StampTool,
  EyeDropper,
  GridTool,
  None,
}

export enum PrimitiveType {
    Abstract,
    Rectangle,
    Path,
    Stamp,
    Line,
    Ellipse,
    Polygon,
    Perimeter,
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

  ChangeRotationRate,

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
  InvalidEvent,
}

export enum KeyboardEventType {
  KeyUp,
  KeyDown,
  ShiftKey,
  InvalidEvent,
}

export const DEFAULT_LINE_STROKE_WIDTH = 2;
export const DEFAULT_LINE_ROUNDING = 20;
export const MAX_LINE_ROUNDING = 100;
export const CIRCLE_RADIUS_FACTOR = 1.5;
export const DEFAULT_STROKE_WIDTH = 5;
export const MIN_STROKE_WIDTH = 1;
export const MAX_STROKE_WIDTH = 50;
export const SHIFT_KEY_CODE = 'Shift';
export const ALT_KEY_CODE = 'Alt';
export const ESCAPE_KEY_CODE = 'Escape';
export const BACKSPACE_KEY_CODE = 'Backspace';
export const SPACE_KEY_CODE = 'Space';
export const ENTER_KEY_CODE = 'Enter';

export const SERVER_BASE_URL = 'http://localhost:3000/api';

export enum SavingType {
  SaveOnServer,
  SaveLocally,
}
export interface SavingTypeInterface  {
  id: SavingType;
  text: string;
}

export const SavingTypeChoice: SavingTypeInterface[] = [
  {id: SavingType.SaveOnServer, text: 'Sauvegarder sur le serveur'},
  // {id: SavingType.SaveLocally, text : 'Sauvegarder localement - Non disponible'},
];

export const MAX_ALPHA = 1;
export const DEFAULT_GRID_ALPHA = 0.5;
export const MIN_GRID_ALPHA = 0.1;
export const MIN_GRID_SIZE = 10 ;
export const MAX_GRID_SIZE = 300 ;

export const LEFT_MOUSE_BUTTON = 0;
export const RIGHT_MOUSE_BUTTON = 2;
