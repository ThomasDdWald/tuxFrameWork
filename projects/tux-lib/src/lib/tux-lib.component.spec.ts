import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TuxLibComponent } from './tux-lib.component';

describe('TuxLibComponent', () => {
  let component: TuxLibComponent;
  let fixture: ComponentFixture<TuxLibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TuxLibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TuxLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
