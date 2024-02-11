import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpoolCardComponent } from './spool-card.component';

describe('SpoolCardComponent', () => {
  let component: SpoolCardComponent;
  let fixture: ComponentFixture<SpoolCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpoolCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpoolCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
