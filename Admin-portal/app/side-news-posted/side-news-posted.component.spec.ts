import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNewsPostedComponent } from './side-news-posted.component';

describe('SideNewsPostedComponent', () => {
  let component: SideNewsPostedComponent;
  let fixture: ComponentFixture<SideNewsPostedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideNewsPostedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNewsPostedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
