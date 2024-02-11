import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpoolWizardComponent } from './spool-wizard.component';

describe('SpoolWizardComponent', () => {
  let component: SpoolWizardComponent;
  let fixture: ComponentFixture<SpoolWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpoolWizardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpoolWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
