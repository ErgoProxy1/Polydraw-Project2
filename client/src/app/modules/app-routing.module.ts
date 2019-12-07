import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { EraserPropertiesComponent } from '../components/properties-bar/properties-menu/eraser-properties/eraser-properties.component';
import { EyeDropperPropertiesComponent
} from '../components/properties-bar/properties-menu/eye-dropper-properties/eye-dropper-properties.component';
import { GridPropertiesComponent } from '../components/properties-bar/properties-menu/grid-properties/grid-properties.component';
import { LinePropertiesComponent } from '../components/properties-bar/properties-menu/line-properties/line-properties.component';
// tslint:disable-next-line
import { PaintBrushPropertiesComponent } from '../components/properties-bar/properties-menu/paint-brush-properties/paint-brush-properties.component';
// tslint:disable-next-line: max-line-length
import { SpraypaintPropertiesComponent } from '../components/properties-bar/properties-menu/spraypaint-properties/spraypaint-properties.component';

// tslint:disable-next-line
import { PaintBucketPropertiesComponent } from '../components/properties-bar/properties-menu/paint-bucket-properties/paint-bucket-properties.component';
import { PenPropertiesComponent } from '../components/properties-bar/properties-menu/pen-properties/pen-properties.component';
import { PencilPropertiesComponent } from '../components/properties-bar/properties-menu/pencil-properties/pencil-properties.component';
import { QuillPropertiesComponent } from '../components/properties-bar/properties-menu/quill-properties/quill-properties.component';
// tslint:disable-next-line
import { SelectionPropertiesComponent } from '../components/properties-bar/properties-menu/selection-properties/selection-properties.component';
import { ShapePropertiesComponent } from '../components/properties-bar/properties-menu/shape-properties/shape-properties.component';
import { StampPropertiesComponent } from '../components/properties-bar/properties-menu/stamp-properties/stamp-properties.component';
import { TextPropertiesComponent } from '../components/properties-bar/properties-menu/text-properties/text-properties.component';
import { RoutingConstants } from '../services/utils/routingConstants';

const appRoutes: Routes = [
  { path: '', redirectTo: RoutingConstants.ROUTE_TO_PENCIL, pathMatch: 'full' },
  { path: RoutingConstants.ROUTE_TO_SHAPE, component: ShapePropertiesComponent },
  { path: RoutingConstants.ROUTE_TO_SHAPE + '/:shapeType', component: ShapePropertiesComponent },
  { path: RoutingConstants.ROUTE_TO_PAINT_BRUSH, component: PaintBrushPropertiesComponent },
  { path: RoutingConstants.ROUTE_TO_SPRAYPAINT, component: SpraypaintPropertiesComponent },
  { path: RoutingConstants.ROUTE_TO_PENCIL, component: PencilPropertiesComponent },
  { path: RoutingConstants.ROUTE_TO_PEN, component: PenPropertiesComponent },
  { path: RoutingConstants.ROUTE_TO_LINE, component: LinePropertiesComponent },
  { path: RoutingConstants.ROUTE_TO_PAINT_BUCKET, component: PaintBucketPropertiesComponent },
  { path: RoutingConstants.ROUTE_TO_PAINT_BUCKET + '/:bucketType', component: PaintBucketPropertiesComponent },
  { path: RoutingConstants.ROUTE_TO_SELECTION, component: SelectionPropertiesComponent },
  { path: RoutingConstants.ROUTE_TO_STAMP, component: StampPropertiesComponent},
  { path: RoutingConstants.ROUTE_TO_EYEDROPPER, component: EyeDropperPropertiesComponent},
  { path: RoutingConstants.ROUTE_TO_GRID, component: GridPropertiesComponent },
  { path: RoutingConstants.ROUTE_TO_ERASER, component: EraserPropertiesComponent },
  { path: RoutingConstants.ROUTE_TO_TEXT, component: TextPropertiesComponent},
  { path: RoutingConstants.ROUTE_TO_QUILL, component: QuillPropertiesComponent},
  { path: '**', redirectTo: RoutingConstants.ROUTE_TO_PENCIL},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})

export class AppRoutingModule {}
