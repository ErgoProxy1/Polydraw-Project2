import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from './components/app/app.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { SvgComponent } from './components/canvas/svg/svg.component';
import { ColorToolComponent } from './components/color-tool/color-tool.component';
import { ExportDrawingComponent } from './components/horizontal-menu/export-drawing/export-drawing.component';
import { HorizontalMenuComponent } from './components/horizontal-menu/horizontal-menu.component';
import { NewDrawingComponent } from './components/horizontal-menu/new-drawing/new-drawing.component';
import { OpenGalleryComponent } from './components/horizontal-menu/open-gallery/open-gallery.component';
import { RedoComponent } from './components/horizontal-menu/redo/redo.component';
import { SaveDrawingComponent } from './components/horizontal-menu/save-drawing/save-drawing.component';
import { UndoComponent } from './components/horizontal-menu/undo/undo.component';
import { PropertiesBarComponent } from './components/properties-bar/properties-bar.component';
import { EraserPropertiesComponent } from './components/properties-bar/properties-menu/eraser-properties/eraser-properties.component';
import { EyeDropperPropertiesComponent
} from './components/properties-bar/properties-menu/eye-dropper-properties/eye-dropper-properties.component';
import { GridPropertiesComponent } from './components/properties-bar/properties-menu/grid-properties/grid-properties.component';
import { LinePropertiesComponent } from './components/properties-bar/properties-menu/line-properties/line-properties.component';
// tslint:disable-next-line
import { PaintBrushPropertiesComponent } from './components/properties-bar/properties-menu/paint-brush-properties/paint-brush-properties.component';
// tslint:disable-next-line
import { PaintBucketPropertiesComponent } from './components/properties-bar/properties-menu/paint-bucket-properties/paint-bucket-properties.component';
import { PenPropertiesComponent } from './components/properties-bar/properties-menu/pen-properties/pen-properties.component';
import { PencilPropertiesComponent } from './components/properties-bar/properties-menu/pencil-properties/pencil-properties.component';
// tslint:disable-next-line
import { SelectionPropertiesComponent } from './components/properties-bar/properties-menu/selection-properties/selection-properties.component';
import { ShapePropertiesComponent } from './components/properties-bar/properties-menu/shape-properties/shape-properties.component';
import { StampPropertiesComponent } from './components/properties-bar/properties-menu/stamp-properties/stamp-properties.component';
import { TextPropertiesComponent } from './components/properties-bar/properties-menu/text-properties/text-properties.component';
import { EraserButtonComponent } from './components/side-bar/icones/eraser-button/eraser-button.component';
import { EyedropperButtonComponent } from './components/side-bar/icones/eyedropper-button/eyedropper-button.component';
import { GridButtonComponent } from './components/side-bar/icones/grid-button/grid-button.component';
import { LineButtonComponent } from './components/side-bar/icones/line-button/line-button.component';
import { PaintBrushButtonComponent } from './components/side-bar/icones/paint-brush-button/paint-brush-button.component';
import { PaintBucketButtonComponent } from './components/side-bar/icones/paint-bucket-button/paint-bucket-button.component';
import { PenButtonComponent } from './components/side-bar/icones/pen-button/pen-button.component';
import { PencilButtonComponent } from './components/side-bar/icones/pencil-button/pencil-button.component';
import { SelectionButtonComponent } from './components/side-bar/icones/selection-button/selection-button.component';
import { ShapesButtonComponent } from './components/side-bar/icones/shapes-button/shapes-button.component';
import { SprayButtonComponent } from './components/side-bar/icones/spray-button/spray-button.component';
import { StampButtonComponent } from './components/side-bar/icones/stamp-button/stamp-button.component';
import { TextButtonComponent } from './components/side-bar/icones/text-button/text-button.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { WelcomeMessageComponent } from './components/welcome-message/welcome-message.component';
import { AppRoutingModule } from './modules/app-routing.module';
import { NTimesPipe } from './pipes/n-times.pipe';
import { TrustPipe } from './pipes/trust-html.pipe';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    ColorToolComponent,
    WelcomeMessageComponent,
    ShapesButtonComponent,
    PaintBrushButtonComponent,
    SideBarComponent,
    PencilButtonComponent,
    PaintBucketButtonComponent,
    SprayButtonComponent,
    PropertiesBarComponent,
    ShapePropertiesComponent,
    PaintBrushPropertiesComponent,
    PencilPropertiesComponent,
    PaintBucketPropertiesComponent,
    HorizontalMenuComponent,
    NewDrawingComponent,
    SaveDrawingComponent,
    OpenGalleryComponent,
    SelectionPropertiesComponent,
    SelectionButtonComponent,
    StampButtonComponent,
    StampPropertiesComponent,
    EyedropperButtonComponent,
    EyeDropperPropertiesComponent,
    LineButtonComponent,
    LinePropertiesComponent,
    NTimesPipe,
    GridButtonComponent,
    GridPropertiesComponent,
    TrustPipe,
    UndoComponent,
    RedoComponent,
    EraserPropertiesComponent,
    EraserButtonComponent,
    TextButtonComponent,
    TextPropertiesComponent,
    ExportDrawingComponent,
    PenPropertiesComponent,
    PenButtonComponent,
    SvgComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    FontAwesomeModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {
}
