import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteForStudentComponent } from './note-for-student.component';

describe('NoteForStudentComponent', () => {
  let component: NoteForStudentComponent;
  let fixture: ComponentFixture<NoteForStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteForStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteForStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
