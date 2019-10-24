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
    ['Dotted', Pattern.DottedLine],
    ['Spaced #1', Pattern.SpacedLine1],
    ['Spaced #2', Pattern.SpacedLine2],
    ['Spaced #3', Pattern.SpacedLine3],
    ['Spaced #4', Pattern.SpacedLine4],
    ['Full', Pattern.FullLine],
  ]);

  readonly LINE_JOIN_NAMES_MAP: Map<string, LineJoin> = new Map([
    ['Arcs', LineJoin.Arcs],
    ['Bevel', LineJoin.Bevel],
    ['Clip', LineJoin.MiterClip],
    ['Miter', LineJoin.Miter],
    ['Point', LineJoin.Point],
    ['Round', LineJoin.Round],
    ['Curved', LineJoin.BezierRound],
  ]);

  readonly LINE_CAP_NAMES_MAP: Map<string, LineCap> = new Map([
    ['None', LineCap.Butt],
    ['Square', LineCap.Square],
    ['Round', LineCap.Round],
  ]);

  readonly MAX_STROKE_WIDTH = MAX_STROKE_WIDTH;
  readonly MIN_STROKE_WIDTH = MIN_STROKE_WIDTH;

  private selectedToolSubscription: Subscription;

  constructor(private toolsService: ToolsService) {
  }

  ngOnInit() {
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

  ngOnDestroy() {
    this.selectedToolSubscription.unsubscribe();
  }

  onChangeStrokeWidth(): void {
    if (this.strokeWidth > MAX_STROKE_WIDTH) {
      this.strokeWidth = MAX_STROKE_WIDTH;
    } else if (this.strokeWidth < MIN_STROKE_WIDTH) {
      this.strokeWidth = MIN_STROKE_WIDTH;
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
    if (this.circleRadius > MAX_STROKE_WIDTH) {
      this.circleRadius = MAX_STROKE_WIDTH;
    } else if (this.circleRadius < MIN_STROKE_WIDTH) {
      this.circleRadius = MIN_STROKE_WIDTH;
    }
    this.line.circleRadius = this.circleRadius;
  }

  onChangeRounding(): void {
    if (this.lineRounding > MAX_LINE_ROUNDING) {
      this.lineRounding = MAX_LINE_ROUNDING;
    } else if (this.lineRounding < DEFAULT_LINE_ROUNDING) {
      this.lineRounding = DEFAULT_LINE_ROUNDING;
    }
    this.line.lineRounding = this.lineRounding;
  }
}
