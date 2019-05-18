import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoblealtoComponent } from './doblealto.component';

describe('DoblealtoComponent', () => {
  let component: DoblealtoComponent;
  let fixture: ComponentFixture<DoblealtoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoblealtoComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoblealtoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
