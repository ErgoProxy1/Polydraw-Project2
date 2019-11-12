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

  readonly _ROUTE_TO_PAINT_BRUSH = RoutingConstants.ROUTE_TO_PAINT_BRUSH;
  readonly _ROUTE_TO_PENCIL = RoutingConstants.ROUTE_TO_PENCIL;
  readonly _ROUTE_TO_PEN = RoutingConstants.ROUTE_TO_PEN;
  readonly _ROUTE_TO_LINE = RoutingConstants.ROUTE_TO_LINE;
  readonly _ROUTE_TO_SHAPE = RoutingConstants.ROUTE_TO_SHAPE;
  readonly _ROUTE_TO_PAINT_BUCKET = RoutingConstants.ROUTE_TO_PAINT_BUCKET;
  readonly _ROUTE_TO_SELECTION = RoutingConstants.ROUTE_TO_SELECTION;
  readonly _ROUTE_TO_GRID = RoutingConstants.ROUTE_TO_GRID;
  readonly _ROUTE_TO_ERASER = RoutingConstants.ROUTE_TO_ERASER;
  readonly _ROUTE_TO_TEXT = RoutingConstants.ROUTE_TO_TEXT;
  readonly _ROUTE_TO_EYEDROPPER = RoutingConstants.ROUTE_TO_EYEDROPPER;
  readonly _ROUTE_TO_STAMP = RoutingConstants.ROUTE_TO_STAMP;

  constructor(private keyboardService: KeyboardService, private router: Router) {
    this.subscription = this.keyboardService.getKeyboardShortcutType().subscribe((keyboardShortcut: KeyboardShortcutType) => {
      switch (keyboardShortcut) {
        case KeyboardShortcutType.PaintBrush:
          this.router.navigate([RoutingConstants.ROUTE_TO_PAINT_BRUSH]);
          break;

        case KeyboardShortcutType.Line:
          this.router.navigate([RoutingConstants.ROUTE_TO_LINE]);
          break;

        case KeyboardShortcutType.Pencil:
          this.router.navigate([RoutingConstants.ROUTE_TO_PENCIL]);
          break;
        case KeyboardShortcutType.Pen:
            this.router.navigate([RoutingConstants.ROUTE_TO_PEN]);
            break;

        case KeyboardShortcutType.Rectangle:
          this.router.navigate([RoutingConstants.ROUTE_TO_SHAPE, RoutingConstants.RECTANGLE_SHAPE_TYPE]);
          break;

        case KeyboardShortcutType.Ellipse:
          this.router.navigate([RoutingConstants.ROUTE_TO_SHAPE, RoutingConstants.ELLIPSE_SHAPE_TYPE]);
          break;

        case KeyboardShortcutType.Polygon:
          this.router.navigate([RoutingConstants.ROUTE_TO_SHAPE, RoutingConstants.POLYGON_SHAPE_TYPE]);
          break;

        case KeyboardShortcutType.ColorApplicator:
          this.router.navigate([RoutingConstants.ROUTE_TO_PAINT_BUCKET]);
          break;
        case KeyboardShortcutType.Dropper:
          this.router.navigate([RoutingConstants.ROUTE_TO_EYEDROPPER]);
          break;
        case KeyboardShortcutType.Select:
          this.router.navigate([RoutingConstants.ROUTE_TO_SELECTION]);
          break;
        case KeyboardShortcutType.Eraser:
          this.router.navigate([RoutingConstants.ROUTE_TO_ERASER]);
          break;
        case KeyboardShortcutType.Text:
          this.router.navigate([RoutingConstants.ROUTE_TO_TEXT]);
          break;
      }
    });
  }
}
