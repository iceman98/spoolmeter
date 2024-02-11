import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpoolModal } from './spool-modal';

describe('TagCardComponent', () => {
  let component: SpoolModal;
  let fixture: ComponentFixture<SpoolModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpoolModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpoolModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
