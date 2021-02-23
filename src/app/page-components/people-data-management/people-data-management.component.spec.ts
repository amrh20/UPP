import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleDataManagementComponent } from './people-data-management.component';

describe('PeopleDataManagementComponent', () => {
  let component: PeopleDataManagementComponent;
  let fixture: ComponentFixture<PeopleDataManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeopleDataManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleDataManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
