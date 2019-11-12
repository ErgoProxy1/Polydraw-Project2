import { OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { KeyboardService } from '../keyboard/keyboard.service';
import { Perimeter } from '../svgPrimitives/rectangle/perimeter/perimeter';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { TextToolCommand } from '../toolCommands/textToolCommand';
import { ToolCommand } from '../toolCommands/toolCommand';
import { Color } from '../utils/color';
import { AlignInfo, ALIGNS, FontInfo, FONTS, KeyboardEventType, MouseEventType, TEXT_CURSOR, ToolType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';
import { Tool } from './tool';

export class TextTool extends Tool implements OnDestroy {
  private keyboardServiceSubscription: Subscription;
  readonly FONTS: FontInfo[] = FONTS;
  readonly ALIGNS: AlignInfo[] = ALIGNS;
  selectedFont = 0;
  selectedAlign = 0;

  type = ToolType.TextTool;

  private command: TextToolCommand;
  private commandSubject: Subject<TextToolCommand> = new Subject<TextToolCommand>();
  typing = false;
  inputted = false;
  position: Point;
  bold = false;
  italics = false;
  size = 16;
  textColor: Color;
  keyAdded: string;

  perimeter: Perimeter;

  constructor(textColor: Color, private keyboardService: KeyboardService) {
    super();
    this.textColor = textColor;

    this.keyboardServiceSubscription = this.keyboardService.getKeyboardEventType().subscribe(
      (keyboardEventType: KeyboardEventType) => {
        this.keyAdded = this.keyboardService.getKeyOut();
        this.keyboardEvent(keyboardEventType);
      },
    );
  }

  ngOnDestroy(): void {
    this.keyboardServiceSubscription.unsubscribe();
  }

  mouseEvent(eventType: MouseEventType, position: Point, primitive?: SVGPrimitive): void {
    this.position = position;
    if (eventType === MouseEventType.MouseDownLeft) {
      (this.typing) ? this.finish(position) : this.begin(position);
      this.temporaryPrimitivesAvailable.next();
    }
  }

  keyboardEvent(eventType: KeyboardEventType): void {
    const inputtable: RegExp = /^.{1}$/igm;
    if (this.typing) {
      if (eventType === KeyboardEventType.KeyDown
        && (inputtable.test(this.keyAdded)
          || this.keyAdded === 'Enter'
          || this.keyAdded === 'Backspace'
          || this.keyAdded.includes('Arrow'))) {
        if (this.inputted) {
          this.update(this.keyAdded);
        }
        this.inputted = !this.inputted;
      }
      this.temporaryPrimitivesAvailable.next();
    }
  }

  subscribeToCommand(): Observable<ToolCommand> {
    return this.commandSubject.asObservable();
  }

  getTemporaryPrimitives(): SVGPrimitive[] {
    return this.typing ? [this.command.text, this.perimeter] : [];
  }

  private begin(position: Point): void {
    this.keyboardService.inputFocusedActive = true;
    this.typing = true;
    this.perimeter = new Perimeter(position);
    this.perimeter.resize(
      new Point(this.perimeter.position.x, this.perimeter.position.y - this.size),
      new Point((this.perimeter.position.x + this.size), this.perimeter.position.y + this.size),
    );
    this.command = new TextToolCommand(
      this.size, this.textColor, this.FONTS[this.selectedFont], this.ALIGNS[this.selectedAlign],
      this.position, this.perimeter, this.bold, this.italics,
    );
  }

  private update(key: string): void {
    if (key === 'Enter') {
      this.command.break();
    } else if (key === 'Backspace') {
      this.command.delete();
    } else if (this.keyAdded.includes('Arrow')) {
      this.command.updateLinePosition(this.keyAdded);
    } else {
      this.command.type(key);
    }
  }

  private finish(position: Point): void {
    if (position.x >= this.perimeter.corner2.x ||
      position.x <= this.perimeter.corner1.x ||
      position.y >= this.perimeter.corner2.y ||
      position.y <= this.perimeter.corner1.y) {
      if (this.typing) {
        this.executeFinishSequence();
      }
    }
  }

  private executeFinishSequence(): void {
    let allLinesEmpty = true;
    this.typing = false;
    if (this.command) {
      this.command.text.lines[this.command.currentLine].innertext =
      this.command.text.lines[this.command.currentLine].innertext.replace('|', '') + '\u00A0';

      for (const line of this.command.text.lines) {
        if (line.innertext.length > 1) {
          allLinesEmpty = false;
          break;
        }
      }
    }

    if (!allLinesEmpty) {
      this.commandSubject.next(this.command);
    }
    this.keyboardService.inputFocusedActive = false;
  }

  getCommand(): TextToolCommand {
    return this.command;
  }

  applyText(): void {
    this.executeFinishSequence();
  }

  getCursor(): string {
    return TEXT_CURSOR;
  }

  standby(): void {
    if (this.typing) {
      this.applyText();
    }
  }
}
