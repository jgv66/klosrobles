import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EerrPage } from './eerr.page';

describe('EerrPage', () => {
  let component: EerrPage;
  let fixture: ComponentFixture<EerrPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EerrPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EerrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
