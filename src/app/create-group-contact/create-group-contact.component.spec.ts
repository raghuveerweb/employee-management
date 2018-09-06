import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGroupContactComponent } from './create-group-contact.component';

describe('CreateGroupContactComponent', () => {
  let component: CreateGroupContactComponent;
  let fixture: ComponentFixture<CreateGroupContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateGroupContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGroupContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
