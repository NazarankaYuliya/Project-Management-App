import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateColumnModalComponent } from './update-column-modal.component';

describe('UpdateColumnsTitleModalComponent', () => {
  let component: UpdateColumnModalComponent;
  let fixture: ComponentFixture<UpdateColumnModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateColumnModalComponent],
    });
    fixture = TestBed.createComponent(UpdateColumnModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
