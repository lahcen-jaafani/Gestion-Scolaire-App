import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsencesForProfComponent } from './absences-for-prof.component';

describe('AbsencesForProfComponent', () => {
  let component: AbsencesForProfComponent;
  let fixture: ComponentFixture<AbsencesForProfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbsencesForProfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbsencesForProfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
