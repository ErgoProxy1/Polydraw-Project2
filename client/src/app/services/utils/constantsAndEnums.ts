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
// ------ FIN DES CONSTANTES DE PALETTE -----------//

export enum ToolType {
  RectangleTool,
  PaintBrushTool,
  Pencil,
  ColorApplicator,
  None,
}

export enum PrimitiveType {
  Abstract,
  Rectangle,
  Path,
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

export const DEFAULT_STROKE_WIDTH = 5;
export const MAX_RGB = 255;
export const MAX_ALPHA = 1;
export const MIN_STROKE_WIDTH = 1;
export const MAX_STROKE_WIDTH = 50;
export const SHIFT_KEY_CODE = 'Shift';
