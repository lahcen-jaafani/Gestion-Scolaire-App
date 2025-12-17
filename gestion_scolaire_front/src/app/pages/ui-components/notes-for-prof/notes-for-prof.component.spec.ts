import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesForProfComponent } from './notes-for-prof.component';

describe('NotesForProfComponent', () => {
  let component: NotesForProfComponent;
  let fixture: ComponentFixture<NotesForProfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotesForProfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotesForProfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
