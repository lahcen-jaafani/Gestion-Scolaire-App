import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MajorManagmaentComponent } from './major-managmaent.component';

describe('MajorManagmaentComponent', () => {
  let component: MajorManagmaentComponent;
  let fixture: ComponentFixture<MajorManagmaentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MajorManagmaentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MajorManagmaentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
