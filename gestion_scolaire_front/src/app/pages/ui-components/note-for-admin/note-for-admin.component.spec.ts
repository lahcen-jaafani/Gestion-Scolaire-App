import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteForAdminComponent } from './note-for-admin.component';

describe('NoteForAdminComponent', () => {
  let component: NoteForAdminComponent;
  let fixture: ComponentFixture<NoteForAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteForAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteForAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
