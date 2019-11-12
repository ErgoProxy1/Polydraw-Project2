import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LineTool } from 'src/app/services/tools/lineTool';
import { ToolsService } from 'src/app/services/tools/tools.service';
import { DEFAULT_LINE_ROUNDING, LineCap, LineJoin,
  MAX_LINE_ROUNDING, MAX_STROKE_WIDTH, MIN_STROKE_WIDTH, Pattern, ToolType } from 'src/app/services/utils/constantsAndEnums';

@Component({
  selector: 'app-line-properties',
  templateUrl: './line-properties.component.html',
  styleUrls: ['./line-properties.component.scss'],
})
export class LinePropertiesComponent implements OnInit, OnDestroy {
  strokeWidth: number;
  circleRadius: number;
  lineRounding: number;
  pattern: Pattern;
  lineJoin: LineJoin = LineJoin.Round;
  lineCap: LineCap;
  line: LineTool;

  readonly PATTERN_NAMES_MAP: Map<string, Pattern> = new Map([
    ['Pointillé', Pattern.DottedLine],
    ['Trait espacé #1', Pattern.SpacedLine1],
    ['Trait espacé #2', Pattern.SpacedLine2],
    ['Trait espacé #3', Pattern.SpacedLine3],
    ['Trait espacé #4', Pattern.SpacedLine4],
    ['Trait plein', Pattern.FullLine],
  ]);

  readonly LINE_JOIN_NAMES_MAP: Map<string, LineJoin> = new Map([
    ['Arcs', LineJoin.Arcs],
    ['Biseau', LineJoin.Bevel],
    ['Clip d\'onglet', LineJoin.MiterClip],
    ['Onglet', LineJoin.Miter],
    ['Point', LineJoin.Point],
    ['Rond par defaut', LineJoin.Round],
    ['Rond de Bezier', LineJoin.BezierRound],
  ]);

  readonly LINE_CAP_NAMES_MAP: Map<string, LineCap> = new Map([
    ['Aucun', LineCap.Butt],
    ['Carré', LineCap.Square],
    ['Rond', LineCap.Round],
  ]);

  readonly MAX_ROUNDING = MAX_LINE_ROUNDING;
  readonly DEFAULT_ROUNDING = DEFAULT_LINE_ROUNDING;
  readonly MAX_STROKE = MAX_STROKE_WIDTH;
  readonly MIN_STROKE = MIN_STROKE_WIDTH;

  private selectedToolSubscription: Subscription;

  constructor(private toolsService: ToolsService) {
  }

  ngOnInit(): void {
    this.selectedToolSubscription = this.toolsService.subscribeToToolChanged().subscribe((toolSelected) => {
      this.line = toolSelected as LineTool;
    });

    this.toolsService.newToolSelected(ToolType.Line);
    this.strokeWidth = this.line.strokeWidth;
    this.pattern = this.line.pattern;
    this.lineJoin = this.line.lineJoin;
    this.lineCap = this.line.lineCap;
    this.circleRadius = this.line.circleRadius;
    this.lineRounding = this.line.lineRounding;
  }

  ngOnDestroy(): void {
    this.selectedToolSubscription.unsubscribe();
  }

  onChangeStrokeWidth(): void {
    if (this.strokeWidth > this.MAX_STROKE) {
      this.strokeWidth = this.MAX_STROKE;
    } else if (this.strokeWidth < this.MIN_STROKE) {
      this.strokeWidth = this.MIN_STROKE;
    }
    this.line.strokeWidth = this.strokeWidth;
  }

  onChangePattern(): void {
    if (this.pattern in Pattern) {
      this.line.pattern = this.pattern;
    } else {
      this.pattern = this.line.pattern;
    }
  }

  onChangeJoin(): void {
    if (this.lineJoin in LineJoin) {
      this.line.lineJoin = this.lineJoin;
    } else {
      this.lineJoin = this.line.lineJoin;
    }
  }

  onChangeCap(): void {
    if (this.lineCap in LineCap) {
      this.line.lineCap = this.lineCap;
    } else {
      this.lineCap = this.line.lineCap;
    }
  }

  onChangeCircleRadius(): void {
    if (this.circleRadius > this.MAX_STROKE) {
      this.circleRadius = this.MAX_STROKE;
    } else if (this.circleRadius < this.MIN_STROKE) {
      this.circleRadius = this.MIN_STROKE;
    }
    this.line.circleRadius = this.circleRadius;
  }

  onChangeRounding(): void {
    if (this.lineRounding > this.MAX_ROUNDING) {
      this.lineRounding = this.MAX_ROUNDING;
    } else if (this.lineRounding < this.DEFAULT_ROUNDING) {
      this.lineRounding = this.DEFAULT_ROUNDING;
    }
    this.line.lineRounding = this.lineRounding;
  }
}
