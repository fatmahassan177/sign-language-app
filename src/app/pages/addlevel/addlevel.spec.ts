import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addlevel } from './addlevel';

describe('Addlevel', () => {
  let component: Addlevel;
  let fixture: ComponentFixture<Addlevel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addlevel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addlevel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
