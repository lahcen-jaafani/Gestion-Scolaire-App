import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericCrudComponentComponent } from './generic-crud-component.component';

describe('GenericCrudComponentComponent', () => {
  let component: GenericCrudComponentComponent;
  let fixture: ComponentFixture<GenericCrudComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericCrudComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericCrudComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
