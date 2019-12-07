import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuillTool } from 'src/app/services/tools/quillTool';
import { ToolsService } from 'src/app/services/tools/tools.service';
import { MAX_ROTATION_ANGLE, MAX_STROKE_WIDTH, MIN_ROTATION_ANGLE, MIN_STROKE_WIDTH,
  ToolType } from 'src/app/services/utils/constantsAndEnums';

@Component({
  selector: 'app-quill-properties',
  templateUrl: './quill-properties.component.html',
  styleUrls: ['./quill-properties.component.scss'],
})
export class QuillPropertiesComponent implements OnInit, OnDestroy {
  readonly MAX_LENGTH = MAX_STROKE_WIDTH;
  readonly MIN_LENGTH = MIN_STROKE_WIDTH;
  readonly MAX_ANGLE = MAX_ROTATION_ANGLE;
  readonly MIN_ANGLE = MIN_ROTATION_ANGLE;

  private selectedToolSubscription: Subscription;
  quillLength = 15;
  rotationAngle = 0;
  quill: QuillTool;

  constructor(private toolsService: ToolsService) { }

  ngOnInit() {
    this.selectedToolSubscription = this.toolsService.subscribeToToolChanged().subscribe((toolSelected) => {
      this.quill = toolSelected as QuillTool;
    });
    this.toolsService.newToolSelected(ToolType.QuillTool);
    this.quillLength = this.quill.baseLength;
    this.applyRotation(this.quill.angle);
    this.quill.quillAngleObservable.subscribe((data) => {
     this.applyRotation(data);
    });
  }

  ngOnDestroy() {
    this.selectedToolSubscription.unsubscribe();
  }

  onChangeQuillLength(): void {
    if (this.quillLength > this.MAX_LENGTH) {
      this.quillLength = this.MAX_LENGTH;
    } else if (this.quillLength < this.MIN_LENGTH) {
      this.quillLength = this.MIN_LENGTH;
    }
    this.quill.baseLength = this.quillLength;
  }

  onChangeRotation(): void {
    if (this.rotationAngle > this.MAX_ANGLE) {
      this.rotationAngle = this.MAX_ANGLE;
    } else if (this.rotationAngle < this.MIN_ANGLE) {
      this.rotationAngle = this.MIN_ANGLE;
    }
    this.quill.angle = this.rotationAngle;
  }

  applyRotation(angle: number) {
    if (angle < this.MIN_ANGLE ) { angle += 360; }
    if (angle > this.MAX_ANGLE) { angle = this.MIN_ANGLE; }
    this.rotationAngle = angle;
  }
}
