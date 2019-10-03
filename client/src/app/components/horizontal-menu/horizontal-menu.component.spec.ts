import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HorizontalMenuComponent } from './horizontal-menu.component';
import { NewDrawingComponent } from './new-drawing/new-drawing.component';

describe('HorizontalMenuComponent', () => {
  let component: HorizontalMenuComponent;
  let fixture: ComponentFixture<HorizontalMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorizontalMenuComponent, NewDrawingComponent ],
      imports: [ FormsModule, ReactiveFormsModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
