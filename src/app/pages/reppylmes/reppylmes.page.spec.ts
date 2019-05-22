import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReppylmesPage } from './reppylmes.page';

describe('ReppylmesPage', () => {
  let component: ReppylmesPage;
  let fixture: ComponentFixture<ReppylmesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReppylmesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReppylmesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
