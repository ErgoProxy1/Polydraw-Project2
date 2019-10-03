import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from './components/app/app.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { ColorToolComponent } from './components/color-tool/color-tool.component';
import { HorizontalMenuComponent } from './components/horizontal-menu/horizontal-menu.component';
import { NewDrawingComponent } from './components/horizontal-menu/new-drawing/new-drawing.component';
import { PropertiesBarComponent } from './components/properties-bar/properties-bar.component';
import { ColorPropertiesComponent } from './components/properties-bar/properties-menu/color-properties/color-properties.component';
// tslint:disable-next-line
import { PaintBrushPropertiesComponent } from './components/properties-bar/properties-menu/paint-brush-properties/paint-brush-properties.component';
// tslint:disable-next-line
import { PaintBucketPropertiesComponent } from './components/properties-bar/properties-menu/paint-bucket-properties/paint-bucket-properties.component';
import { PencilPropertiesComponent } from './components/properties-bar/properties-menu/pencil-properties/pencil-properties.component';
import { ShapePropertiesComponent } from './components/properties-bar/properties-menu/shape-properties/shape-properties.component';
import { ColorButtonComponent } from './components/side-bar/icones/color-button/color-button.component';
import { PaintBrushButtonComponent } from './components/side-bar/icones/paint-brush-button/paint-brush-button.component';
import { PaintBucketButtonComponent } from './components/side-bar/icones/paint-bucket-button/paint-bucket-button.component';
import { PencilButtonComponent } from './components/side-bar/icones/pencil-button/pencil-button.component';
import { ShapesButtonComponent } from './components/side-bar/icones/shapes-button/shapes-button.component';
import { SprayButtonComponent } from './components/side-bar/icones/spray-button/spray-button.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { WelcomeMessageComponent } from './components/welcome-message/welcome-message.component';
import { AppRoutingModule } from './modules/app-routing.module';

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
    ColorButtonComponent,
    SprayButtonComponent,
    PropertiesBarComponent,
    ShapePropertiesComponent,
    PaintBrushPropertiesComponent,
    PencilPropertiesComponent,
    ColorPropertiesComponent,
    PaintBucketPropertiesComponent,
    HorizontalMenuComponent,
    NewDrawingComponent,
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
