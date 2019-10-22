import { Color } from 'src/app/services/utils/color';
import { StrokeType } from 'src/app/services/utils/constantsAndEnums';
import { Point } from 'src/app/services/utils/point';
import { Ellipse } from '../ellispe';

export class Handle extends Ellipse {
    selectable = false;

    constructor(position: Point) {
        super(Color.WHITE, Color.BLACK, 1, StrokeType.FullWithOutline, position, 5, 5);
    }
}
