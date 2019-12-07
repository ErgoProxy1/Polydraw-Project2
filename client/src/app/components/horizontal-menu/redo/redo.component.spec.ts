import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { RedoComponent } from './redo.component';

describe('RedoComponent', () => {
  let component: RedoComponent;
  let fixture: ComponentFixture<RedoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RedoComponent],
      imports: [HttpClientModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
