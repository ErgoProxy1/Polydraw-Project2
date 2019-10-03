import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { KeyboardShortcutService } from 'src/app/services/keyboardShortcut/keyboard-shortcut.service';
import { KeyboardShortcutType } from 'src/app/services/utils/constantsAndEnums';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent {
  subscription: Subscription;
  constructor(private keyboardShortcutService: KeyboardShortcutService, private router: Router) {
    this.subscription = this.keyboardShortcutService.getKeyboardShortcutType().subscribe((keyboardShortcut: KeyboardShortcutType) => {
      switch (keyboardShortcut) {
        case KeyboardShortcutType.PaintBrush:
          this.router.navigate(['/paint-brush']);
          break;

        case KeyboardShortcutType.Pencil:
          this.router.navigate(['/pencil']);
          break;

        case KeyboardShortcutType.Rectangle:
          this.router.navigate(['/shapes']);
          break;

        case KeyboardShortcutType.ColorApplicator:
          this.router.navigate(['/paint-bucket']);
          break;
      }
    });
  }
}
