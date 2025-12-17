import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnonceCrudComponent } from './announces-detaille.component';




describe('AnnouncesDetailleComponent', () => {
  let component: AnonceCrudComponent;
  let fixture: ComponentFixture<AnonceCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnonceCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnonceCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
