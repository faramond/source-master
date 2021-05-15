import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidePendingComponent } from './side-pending.component';

describe('SidePendingComponent', () => {
  let component: SidePendingComponent;
  let fixture: ComponentFixture<SidePendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidePendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidePendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
