import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbModalModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { TrustPipe } from 'src/app/pipes/trust-html.pipe';
import { OpenGalleryComponent } from './open-gallery.component';

describe('OpenGalleryComponent', () => {
  let component: OpenGalleryComponent;
  let fixture: ComponentFixture<OpenGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenGalleryComponent, TrustPipe],
      imports: [FormsModule, ReactiveFormsModule, NgbModalModule, NgbAlertModule, NgbTypeaheadModule, HttpClientModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
