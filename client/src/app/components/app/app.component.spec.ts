import {HttpClientModule} from '@angular/common/http';
import {async, TestBed} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CookieService } from 'ngx-cookie-service';
import { CanvasComponent } from '../canvas/canvas.component';
import { ColorToolComponent } from '../color-tool/color-tool.component';
import { HorizontalMenuComponent } from '../horizontal-menu/horizontal-menu.component';
import { NewDrawingComponent } from '../horizontal-menu/new-drawing/new-drawing.component';
import { PropertiesBarComponent } from '../properties-bar/properties-bar.component';
import { LinePropertiesComponent } from '../properties-bar/properties-menu/line-properties/line-properties.component';
import { PaintBrushPropertiesComponent } from '../properties-bar/properties-menu/paint-brush-properties/paint-brush-properties.component';
// tslint:disable-next-line
import { PaintBucketPropertiesComponent } from '../properties-bar/properties-menu/paint-bucket-properties/paint-bucket-properties.component';
import { PencilPropertiesComponent } from '../properties-bar/properties-menu/pencil-properties/pencil-properties.component';
import { ShapePropertiesComponent } from '../properties-bar/properties-menu/shape-properties/shape-properties.component';
import { LineButtonComponent } from '../side-bar/icones/line-button/line-button.component';
import { PaintBrushButtonComponent } from '../side-bar/icones/paint-brush-button/paint-brush-button.component';
import { PaintBucketButtonComponent } from '../side-bar/icones/paint-bucket-button/paint-bucket-button.component';
import { PencilButtonComponent } from '../side-bar/icones/pencil-button/pencil-button.component';
import { ShapesButtonComponent } from '../side-bar/icones/shapes-button/shapes-button.component';
import { SprayButtonComponent } from '../side-bar/icones/spray-button/spray-button.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { WelcomeMessageComponent } from '../welcome-message/welcome-message.component';

import { NgbAlertModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NTimesPipe } from 'src/app/pipes/n-times.pipe';
import { TrustPipe } from 'src/app/pipes/trust-html.pipe';
import { OpenGalleryComponent } from '../horizontal-menu/open-gallery/open-gallery.component';
import { SaveDrawingComponent } from '../horizontal-menu/save-drawing/save-drawing.component';
import { EyeDropperPropertiesComponent } from '../properties-bar/properties-menu/eye-dropper-properties/eye-dropper-properties.component';
import { SelectionPropertiesComponent } from '../properties-bar/properties-menu/selection-properties/selection-properties.component';
import { StampPropertiesComponent } from '../properties-bar/properties-menu/stamp-properties/stamp-properties.component';
import { EyedropperButtonComponent } from '../side-bar/icones/eyedropper-button/eyedropper-button.component';
import { GridButtonComponent } from '../side-bar/icones/grid-button/grid-button.component';
import { SelectionButtonComponent } from '../side-bar/icones/selection-button/selection-button.component';
import { StampButtonComponent } from '../side-bar/icones/stamp-button/stamp-button.component';
import {AppComponent} from './app.component';

describe('AppComponent', () => {
  beforeEach(() => {
    // empty
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        FontAwesomeModule,
        FormsModule,
        ReactiveFormsModule,
        NgbAlertModule,
        NgbTypeaheadModule,
        HttpClientModule,
      ],
      declarations: [
        AppComponent,
        CanvasComponent,
        WelcomeMessageComponent,
        ShapesButtonComponent,
        PaintBrushButtonComponent,
        SideBarComponent,
        PencilButtonComponent,
        PaintBucketButtonComponent,
        SprayButtonComponent,
        GridButtonComponent,
        PropertiesBarComponent,
        ShapePropertiesComponent,
        PaintBrushPropertiesComponent,
        PencilPropertiesComponent,
        PaintBucketPropertiesComponent,
        HorizontalMenuComponent,
        NewDrawingComponent,
        LinePropertiesComponent,
        LineButtonComponent,
        ColorToolComponent,
        EyeDropperPropertiesComponent,
        EyedropperButtonComponent,
        StampButtonComponent,
        StampPropertiesComponent,
        SelectionButtonComponent,
        SelectionPropertiesComponent,
        NTimesPipe,
        SaveDrawingComponent,
        OpenGalleryComponent,
        TrustPipe,
      ],
      providers: [
        CookieService,
        HttpClientModule,
      ],
    });
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'PolyDessin'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('PolyDessin');
  });
});
