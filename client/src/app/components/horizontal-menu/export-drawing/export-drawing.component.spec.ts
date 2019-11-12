import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { KeyboardService } from 'src/app/services/keyboard/keyboard.service';
import { DrawingCommunicationService } from 'src/app/services/serverCommunication/drawing-communication.service';
import { ExportType } from 'src/app/services/utils/constantsAndEnums';
import { ExportDrawingComponent } from './export-drawing.component';

describe('ExportDrawingComponent', () => {
  let component: ExportDrawingComponent;
  let fixture: ComponentFixture<ExportDrawingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExportDrawingComponent],
      providers: [DrawingCommunicationService, KeyboardService],
      imports: [FormsModule, ReactiveFormsModule, NgbModalModule, NgbAlertModule, HttpClientModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('modal window is properly opened', () => {
    expect(component.openModal()).toBe(true);
    expect(component.exportError).toBe(false);
    expect(component.exportInfo.typeOfExport.id).toBe(ExportType.BMP);
    expect(component.exportInfo.dimensions).toEqual([0, 0]);
    expect(component.exportInfo.uri).toBe('');
  });

  it('modal window is properly closed', () => {
    expect(component.closeModal()).toBe(false);
  });

  it('export type is properly changed', () => {
    expect(component.exportInfo.typeOfExport.id).toBe(ExportType.BMP);

    component.onChangeExportType('.jpg');
    expect(component.exportInfo.typeOfExport.id).toBe(ExportType.JPG);

    component.onChangeExportType('.png');
    expect(component.exportInfo.typeOfExport.id).toBe(ExportType.PNG);

    component.onChangeExportType('.svg');
    expect(component.exportInfo.typeOfExport.id).toBe(ExportType.SVG);

    component.onChangeExportType('.test'); // Invalide
    expect(component.exportInfo.typeOfExport.id).toBe(ExportType.SVG);
  });

  it('conversion is properly handled', async () => {
    component.exportInfo.uri = 'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9z\
    dmciIF9uZ2NvbnRlbnQtZnNhLWM0PSIiIGNsYXNzPSJzdmdDb250YWluZXIiIHZpZXdCb3g9IjAgMCA3MTAgNzIxIiBzdHlsZT0iYmFja2dyb3VuZC1jb\
    2xvcjogcmdiKDI1NSwgMjU1LCAyNTUpOyIgd2lkdGg9IjcxMCIgaGVpZ2h0PSI3MjEiPjwhLS1iaW5kaW5ncz17CiAgIm5nLXJlZmxlY3QtbmctaWYiOiA\
    iZmFsc2UiCn0tLT48IS0tYmluZGluZ3M9ewogICJuZy1yZWZsZWN0LW5nLWZvci1vZiI6ICIiCn0tLT48IS0tYmluZGluZ3M9ewogICJuZy1yZWZsZWN0LW\
    5nLWZvci1vZiI6ICIiCn0tLT48L3N2Zz4=';
    component.exportInfo.dimensions = [500, 500];

    component.onChangeExportType('.svg');
    // tslint:disable-next-line: no-string-literal
    component.url = await component['convertXMLToExportType']();
    expect(component.url).toContain('data:image/svg+xml;charset=utf-8;base64');

    fixture.detectChanges();

    component.onChangeExportType('.png');
    // tslint:disable-next-line: no-string-literal
    component.url = await component['convertXMLToExportType']();
    expect(component.url).toContain('data:application/octet-stream');

    fixture.detectChanges();

    component.onChangeExportType('.bmp');
    // tslint:disable-next-line: no-string-literal
    component.url = await component['convertXMLToExportType']();
    expect(component.url).toContain('blob');

    fixture.detectChanges();

    component.onChangeExportType('.jpg');
    // tslint:disable-next-line: no-string-literal
    component.url = await component['convertXMLToExportType']();
    expect(component.url).toContain('data:application/octet-stream');
  });
});
