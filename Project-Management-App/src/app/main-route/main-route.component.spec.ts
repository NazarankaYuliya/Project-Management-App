import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainRouteComponent } from './main-route.component';

describe('MainRouteComponent', () => {
  let component: MainRouteComponent;
  let fixture: ComponentFixture<MainRouteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainRouteComponent]
    });
    fixture = TestBed.createComponent(MainRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
