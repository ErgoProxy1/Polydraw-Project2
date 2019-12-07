import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { KeyboardService } from 'src/app/services/keyboard/keyboard.service';
import { KeyboardShortcutType } from 'src/app/services/utils/constantsAndEnums';
import { RoutingConstants } from 'src/app/services/utils/routingConstants';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent {
  subscription: Subscription;

  readonly _ROUTE_TO_PAINT_BRUSH: string = RoutingConstants.ROUTE_TO_PAINT_BRUSH;
  readonly _ROUTE_TO_SPRAYPAINT: string = RoutingConstants.ROUTE_TO_SPRAYPAINT;
  readonly _ROUTE_TO_PENCIL: string = RoutingConstants.ROUTE_TO_PENCIL;
  readonly _ROUTE_TO_PEN: string = RoutingConstants.ROUTE_TO_PEN;
  readonly _ROUTE_TO_LINE: string = RoutingConstants.ROUTE_TO_LINE;
  readonly _ROUTE_TO_SHAPE: string = RoutingConstants.ROUTE_TO_SHAPE;
  readonly _ROUTE_TO_PAINT_BUCKET: string = RoutingConstants.ROUTE_TO_PAINT_BUCKET;
  readonly _ROUTE_TO_SELECTION: string = RoutingConstants.ROUTE_TO_SELECTION;
  readonly _ROUTE_TO_GRID: string = RoutingConstants.ROUTE_TO_GRID;
  readonly _ROUTE_TO_ERASER: string = RoutingConstants.ROUTE_TO_ERASER;
  readonly _ROUTE_TO_TEXT: string = RoutingConstants.ROUTE_TO_TEXT;
  readonly _ROUTE_TO_EYEDROPPER: string = RoutingConstants.ROUTE_TO_EYEDROPPER;
  readonly _ROUTE_TO_STAMP: string = RoutingConstants.ROUTE_TO_STAMP;
  readonly _ROUTE_TO_QUILL: string = RoutingConstants.ROUTE_TO_QUILL;

  readonly ROUTEMAP: Map<KeyboardShortcutType, string> = new Map([
    [KeyboardShortcutType.PaintBrush, this._ROUTE_TO_PAINT_BRUSH],
    [KeyboardShortcutType.Line, this._ROUTE_TO_LINE],
    [KeyboardShortcutType.Pencil, this._ROUTE_TO_PENCIL],
    [KeyboardShortcutType.Pen, this._ROUTE_TO_PEN],
    [KeyboardShortcutType.Quill, this._ROUTE_TO_QUILL],
    [KeyboardShortcutType.SprayPaint, this._ROUTE_TO_SPRAYPAINT],
    [KeyboardShortcutType.Rectangle, `${this._ROUTE_TO_SHAPE}/${RoutingConstants.RECTANGLE_SHAPE_TYPE}`],
    [KeyboardShortcutType.Ellipse, `${this._ROUTE_TO_SHAPE}/${RoutingConstants.ELLIPSE_SHAPE_TYPE}`],
    [KeyboardShortcutType.Polygon, `${this._ROUTE_TO_SHAPE}/${RoutingConstants.POLYGON_SHAPE_TYPE}`],
    [KeyboardShortcutType.ColorApplicator, `${this._ROUTE_TO_PAINT_BUCKET}/${RoutingConstants.COLOR_APPLICATOR_TYPE}`],
    [KeyboardShortcutType.PaintBucket, `${this._ROUTE_TO_PAINT_BUCKET}/${RoutingConstants.PAINT_BUCKET_FILL_TYPE}`],
    [KeyboardShortcutType.Dropper, this._ROUTE_TO_EYEDROPPER],
    [KeyboardShortcutType.Select, this._ROUTE_TO_SELECTION],
    [KeyboardShortcutType.Eraser, this._ROUTE_TO_ERASER],
    [KeyboardShortcutType.Text, this._ROUTE_TO_TEXT],
  ]);

  constructor(private keyboardService: KeyboardService, private router: Router) {
    this.subscription = this.keyboardService.getKeyboardShortcutType().subscribe((keyboardShortcut: KeyboardShortcutType) => {
      const url: string | undefined = this.ROUTEMAP.get(keyboardShortcut);
      if (url) {
        this.router.navigateByUrl(url);
      }
    });
  }
}
