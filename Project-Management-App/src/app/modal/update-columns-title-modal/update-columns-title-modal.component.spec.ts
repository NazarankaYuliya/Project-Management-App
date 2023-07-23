import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateColumnsTitleModalComponent } from './update-columns-title-modal.component';

describe('UpdateColumnsTitleModalComponent', () => {
  let component: UpdateColumnsTitleModalComponent;
  let fixture: ComponentFixture<UpdateColumnsTitleModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateColumnsTitleModalComponent]
    });
    fixture = TestBed.createComponent(UpdateColumnsTitleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
