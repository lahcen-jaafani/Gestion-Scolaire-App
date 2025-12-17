import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentsManagmentComponent } from './departments-managment.component';

describe('DepartmentsManagmentComponent', () => {
  let component: DepartmentsManagmentComponent;
  let fixture: ComponentFixture<DepartmentsManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentsManagmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentsManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
