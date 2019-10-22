import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { KeyboardShortcutService } from 'src/app/services/keyboardShortcut/keyboard-shortcut.service';
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
  readonly _ROUTE_TO_LINE = RoutingConstants.ROUTE_TO_LINE;
  readonly _ROUTE_TO_SHAPE = RoutingConstants.ROUTE_TO_SHAPE;
  readonly _ROUTE_TO_PAINT_BUCKET = RoutingConstants.ROUTE_TO_PAINT_BUCKET;
  readonly _ROUTE_TO_SELECTION = RoutingConstants.ROUTE_TO_SELECTION;
  readonly _ROUTE_TO_GRID = RoutingConstants.ROUTE_TO_GRID;

  constructor(private keyboardShortcutService: KeyboardShortcutService, private router: Router) {
    this.subscription = this.keyboardShortcutService.getKeyboardShortcutType().subscribe((keyboardShortcut: KeyboardShortcutType) => {
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
      }
    });
  }
}
