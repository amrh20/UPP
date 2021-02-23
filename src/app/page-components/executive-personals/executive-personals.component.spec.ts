import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutivePersonalsComponent } from './executive-personals.component';

describe('ExecutivePersonalsComponent', () => {
  let component: ExecutivePersonalsComponent;
  let fixture: ComponentFixture<ExecutivePersonalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutivePersonalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutivePersonalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
