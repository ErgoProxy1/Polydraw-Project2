import { Stamp } from '../svgPrimitives/stamp/stamp';
import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { Point } from '../utils/point';
import { StampInfo } from '../utils/stampData';
import { ToolCommand } from './toolCommand';

export class StampToolCommand implements ToolCommand {
    stamp: Stamp;

    constructor(scale: number, angle: number, position: Point, info: StampInfo) {
        this.stamp = new Stamp(scale, angle, position, info);
    }

    rotate(rate: number) {
        this.stamp.angle =  this.stamp.angle + rate;
        this.stamp.rotation = 'rotate(' + (-1) * this.stamp.angle + ', '
        + (this.stamp.scale) * this.stamp.info.centerX + ', ' + (this.stamp.scale) * this.stamp.info.centerY + ')';

        this.stamp.translation = 'translate(' + this.stamp.position.x + ',' + this.stamp.position.y + ')';
        this.stamp.transformations = this.stamp.translation + this.stamp.rotation + this.stamp.scaled;
    }

    move(newPosition: Point) {
        this.stamp.position = newPosition;
        this.stamp.rotation = 'rotate(' + (-1) * this.stamp.angle + ', '
        + (this.stamp.scale) * this.stamp.info.centerX + ', ' + (this.stamp.scale) * this.stamp.info.centerY + ')';

        this.stamp.translation = 'translate(' + this.stamp.position.x + ',' + this.stamp.position.y + ')';
        this.stamp.transformations = this.stamp.translation + this.stamp.rotation + this.stamp.scaled;
    }

    apply(): SVGPrimitive {
        return this.stamp;
    }

    cancel(): void {
        return;
    }
}
