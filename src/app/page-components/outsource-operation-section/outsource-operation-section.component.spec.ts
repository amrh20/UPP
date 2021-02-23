import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutsourceOperationSectionComponent } from './outsource-operation-section.component';

describe('OutsourceOperationSectionComponent', () => {
  let component: OutsourceOperationSectionComponent;
  let fixture: ComponentFixture<OutsourceOperationSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutsourceOperationSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutsourceOperationSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
