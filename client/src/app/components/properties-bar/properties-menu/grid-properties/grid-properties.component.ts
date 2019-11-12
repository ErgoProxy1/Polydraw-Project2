import { Component, OnInit } from '@angular/core';
import { Grid } from 'src/app/services/tools/grid';
import { ToolsService } from 'src/app/services/tools/tools.service';
import { MAX_ALPHA, MAX_GRID_SIZE, MIN_GRID_ALPHA, MIN_GRID_SIZE, ToolType } from 'src/app/services/utils/constantsAndEnums';

@Component({
  selector: 'app-grid-properties',
  templateUrl: './grid-properties.component.html',
  styleUrls: ['./grid-properties.component.scss'],
})
export class GridPropertiesComponent implements OnInit {

  gridInfo: Grid;
  sizeOfSquare: number;
  readonly MIN_TRANSPARENCY = MIN_GRID_ALPHA;
  readonly MAX_TRANSPARENCY = MAX_ALPHA;
  readonly MIN_SQUARE_SIZE = MIN_GRID_SIZE;
  readonly MAX_SQUARE_SIZE = MAX_GRID_SIZE;

  constructor(private toolsService: ToolsService) { }

  ngOnInit(): void {
    this.gridInfo = this.toolsService.gridInfo;
    this.sizeOfSquare = this.gridInfo.sizeOfSquare();
    this.toolsService.newToolSelected(ToolType.GridTool);
    this.toolsService.changeGridProperties(this.sizeOfSquare, this.gridInfo.colorStroke.a);
    this.toolsService.subscribeToGrid().subscribe((data) => {
      this.gridInfo = data;
      this.sizeOfSquare = this.gridInfo.sizeOfSquare();
    });
  }

  onSquareChange(): void {
    if (this.sizeOfSquare < this.MIN_SQUARE_SIZE) {
      this.sizeOfSquare = this.MIN_SQUARE_SIZE;
    } else if (this.sizeOfSquare > this.MAX_SQUARE_SIZE) {
      this.sizeOfSquare = this.MAX_SQUARE_SIZE;
    }
    if (this.gridInfo.colorStroke.a < this.MIN_TRANSPARENCY) {
      this.gridInfo.colorStroke.a = this.MIN_TRANSPARENCY;
    } else if (this.gridInfo.colorStroke.a > this.MAX_TRANSPARENCY) {
      this.gridInfo.colorStroke.a = this.MAX_TRANSPARENCY;
    }
    this.gridInfo.sizeOfSquare(this.sizeOfSquare);
    this.toolsService.changeGridProperties(this.sizeOfSquare, this.gridInfo.colorStroke.a);

  }
}
