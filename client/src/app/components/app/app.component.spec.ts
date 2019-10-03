import {HttpClientModule} from '@angular/common/http';
import {async, TestBed} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CookieService } from 'ngx-cookie-service';
import {of} from 'rxjs';
import {IndexService} from '../../services/index/index.service';
import { CanvasComponent } from '../canvas/canvas.component';
import { ColorToolComponent } from '../color-tool/color-tool.component';
import SpyObj = jasmine.SpyObj;
import { HorizontalMenuComponent } from '../horizontal-menu/horizontal-menu.component';
import { NewDrawingComponent } from '../horizontal-menu/new-drawing/new-drawing.component';
import { PropertiesBarComponent } from '../properties-bar/properties-bar.component';
import { ColorPropertiesComponent } from '../properties-bar/properties-menu/color-properties/color-properties.component';
import { PaintBrushPropertiesComponent } from '../properties-bar/properties-menu/paint-brush-properties/paint-brush-properties.component';
// tslint:disable-next-line
import { PaintBucketPropertiesComponent } from '../properties-bar/properties-menu/paint-bucket-properties/paint-bucket-properties.component';
import { PencilPropertiesComponent } from '../properties-bar/properties-menu/pencil-properties/pencil-properties.component';
import { ShapePropertiesComponent } from '../properties-bar/properties-menu/shape-properties/shape-properties.component';
import { ColorButtonComponent } from '../side-bar/icones/color-button/color-button.component';
import { PaintBrushButtonComponent } from '../side-bar/icones/paint-brush-button/paint-brush-button.component';
import { PaintBucketButtonComponent } from '../side-bar/icones/paint-bucket-button/paint-bucket-button.component';
import { PencilButtonComponent } from '../side-bar/icones/pencil-button/pencil-button.component';
import { ShapesButtonComponent } from '../side-bar/icones/shapes-button/shapes-button.component';
import { SprayButtonComponent } from '../side-bar/icones/spray-button/spray-button.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { WelcomeMessageComponent } from '../welcome-message/welcome-message.component';
import {AppComponent} from './app.component';

describe('AppComponent', () => {
  let indexServiceSpy: SpyObj<IndexService>;

  beforeEach(() => {
    indexServiceSpy = jasmine.createSpyObj('IndexService', ['basicGet']);
    indexServiceSpy.basicGet.and.returnValue(of({title: '', body: ''}));
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        FontAwesomeModule,
        FormsModule,
        ReactiveFormsModule,
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
        ColorToolComponent,
      ],
      providers: [
        {provide: IndexService, useValue: indexServiceSpy},
        CookieService,
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
