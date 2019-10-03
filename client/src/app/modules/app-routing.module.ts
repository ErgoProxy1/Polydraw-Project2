import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
// tslint:disable-next-line
import { PaintBrushPropertiesComponent } from '../components/properties-bar/properties-menu/paint-brush-properties/paint-brush-properties.component';
// tslint:disable-next-line
import { PaintBucketPropertiesComponent } from '../components/properties-bar/properties-menu/paint-bucket-properties/paint-bucket-properties.component';
import { PencilPropertiesComponent } from '../components/properties-bar/properties-menu/pencil-properties/pencil-properties.component';
import { ShapePropertiesComponent } from '../components/properties-bar/properties-menu/shape-properties/shape-properties.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'pencil', pathMatch: 'full' },
  { path: 'shapes', component: ShapePropertiesComponent },
  { path: 'paint-brush', component: PaintBrushPropertiesComponent },
  { path: 'pencil', component: PencilPropertiesComponent },
  { path: 'paint-bucket', component: PaintBucketPropertiesComponent },
  { path: '**', redirectTo: 'pencil'},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})

export class AppRoutingModule {}
