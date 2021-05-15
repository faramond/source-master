import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideApprovedComponent } from './side-approved.component';

describe('SideApprovedComponent', () => {
  let component: SideApprovedComponent;
  let fixture: ComponentFixture<SideApprovedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideApprovedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
