import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideCreatorComponent } from './side-creator.component';

describe('SideCreatorComponent', () => {
  let component: SideCreatorComponent;
  let fixture: ComponentFixture<SideCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
