import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBoardModalComponent } from './add-board-modal.component';

describe('AddBoardModalComponent', () => {
  let component: AddBoardModalComponent;
  let fixture: ComponentFixture<AddBoardModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddBoardModalComponent]
    });
    fixture = TestBed.createComponent(AddBoardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
