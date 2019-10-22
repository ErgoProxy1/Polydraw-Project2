import { TagsInfo } from './tags';
export interface DrawingInfo {
  name: string;
  typeOfSave: number;
  canvasInfo: string;
  tags: TagsInfo[];
  primitives: string;
  thumbnail: string;
}
