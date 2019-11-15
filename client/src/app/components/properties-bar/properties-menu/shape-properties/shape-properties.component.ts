import { Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PolygonTool } from 'src/app/services/tools/polygonTool';
import { ShapeTool } from 'src/app/services/tools/shapeTool';
import { ToolsService } from 'src/app/services/tools/tools.service';
import { MAX_STROKE_WIDTH, MIN_STROKE_WIDTH, POLYGON_NAMES, StrokeType, ToolType } from 'src/app/services/utils/constantsAndEnums';
import { RoutingConstants } from 'src/app/services/utils/routingConstants';

@Component({
  selector: 'app-shape-properties',
  templateUrl: './shape-properties.component.html',
  styleUrls: ['./shape-properties.component.scss'],
})
export class ShapePropertiesComponent implements OnInit, OnDestroy {
  private selectedToolSubscription: Subscription;
  private routeParametersSubscription: Subscription;
  tool: ShapeTool;
  private toolType: ToolType = ToolType.RectangleTool;
  readonly SHAPE_TYPE_NAMES_MAP: Map<string, ToolType> = new Map([
    ['Rectangle', ToolType.RectangleTool],
    ['Ellipses', ToolType.EllipseTool],
    ['Polygon', ToolType.PolygonTool],
  ]);
  readonly STROKE_TYPE_NAMES_MAP: Map<string, StrokeType> = new Map([
    ['Stroke and Fill', StrokeType.FullWithOutline],
    ['Fill Only', StrokeType.Full],
    ['Stroke Only', StrokeType.Outline],
  ]);
  readonly POLYGONS: Map<number, string> = POLYGON_NAMES;
  readonly POLYGON_TYPE = ToolType.PolygonTool;
  readonly MAX_STROKE = MAX_STROKE_WIDTH;
  readonly MIN_STROKE = MIN_STROKE_WIDTH;

  private strokeWidth: number;
  private numberSidesPolygon = 3;
  private strokeType: StrokeType;

  constructor(private toolsService: ToolsService, private router: Router, private route: ActivatedRoute) {
    this.ngOnInit();
    if (this.tool && this.tool.type === ToolType.PolygonTool) {
     this.numberSidesPolygon = (this.tool as PolygonTool).numberOfSides;
    }
   }

  ngOnInit(): void {
    this.selectedToolSubscription = this.toolsService.subscribeToToolChanged().subscribe((toolSelected) => {
      this.tool = toolSelected as ShapeTool;
      if (this.tool) {
        this.toolType = this.tool.type;
        this.strokeWidth = this.tool.strokeWidth;
        this.strokeType = this.tool.strokeType;
      }
    });

    this.routeParametersSubscription = this.route.params.subscribe((params) => {
      const shapeType: string = params.shapeType;
      if (shapeType) {
        if (shapeType === RoutingConstants.RECTANGLE_SHAPE_TYPE) {
          this.toolType = ToolType.RectangleTool;
          this.toolsService.newToolSelected(this.toolType);
        } else if (shapeType === RoutingConstants.ELLIPSE_SHAPE_TYPE) {
          this.toolType = ToolType.EllipseTool;
          this.toolsService.newToolSelected(this.toolType);
        } else if (shapeType === RoutingConstants.POLYGON_SHAPE_TYPE) {
          this.toolType = ToolType.PolygonTool;
          this.toolsService.newToolSelected(this.toolType);
        }
      } else {
        this.toolType = this.toolsService.getCurrentShapeToolTypeSelected();
        this.onChangeShapeType();
      }
    });
  }

  ngOnDestroy(): void {
    this.selectedToolSubscription.unsubscribe();
    this.routeParametersSubscription.unsubscribe();
  }

  onChangeShapeType(): void {
    switch (this.toolType) {
      case ToolType.RectangleTool:
        this.router.navigate([RoutingConstants.ROUTE_TO_SHAPE, RoutingConstants.RECTANGLE_SHAPE_TYPE]);
        break;
      case ToolType.EllipseTool:
        this.router.navigate([RoutingConstants.ROUTE_TO_SHAPE, RoutingConstants.ELLIPSE_SHAPE_TYPE]);
        break;
      case ToolType.PolygonTool:
        this.router.navigate([RoutingConstants.ROUTE_TO_SHAPE, RoutingConstants.POLYGON_SHAPE_TYPE]);
    }
    this.toolsService.newToolSelected(this.toolType);
  }

  onChangeStrokeWidth(): void {
    if (this.strokeWidth > this.MAX_STROKE) {
      this.strokeWidth = this.MAX_STROKE;
    } else if (this.strokeWidth < this.MIN_STROKE) {
      this.strokeWidth = this.MIN_STROKE;
    }
    if (this.tool) {
      this.tool.strokeWidth = this.strokeWidth;
    }
  }

  setNumberOfSide(value: number) {
    this.numberSidesPolygon = value;
  }

  getNumberOfSide(): number {
    return this.numberSidesPolygon;
  }

  onChangeStrokeType(): void {
    if (this.tool) {
      if (this.strokeType in StrokeType) {
        this.tool.strokeType = this.strokeType;
      } else {
        this.strokeType = this.tool.strokeType;
      }
    }
  }
  onChangeSidesNumber(): void {
    if (this.tool && this.toolType === ToolType.PolygonTool) {
      (this.tool as PolygonTool).numberOfSides = this.numberSidesPolygon;
    }
  }
}
