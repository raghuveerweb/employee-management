import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGroupInformationComponent } from './edit-group-information.component';

describe('EditGroupInformationComponent', () => {
  let component: EditGroupInformationComponent;
  let fixture: ComponentFixture<EditGroupInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGroupInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGroupInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
