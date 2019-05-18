import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DobletextComponent } from './dobletext.component';

describe('DobletextComponent', () => {
  let component: DobletextComponent;
  let fixture: ComponentFixture<DobletextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DobletextComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DobletextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
