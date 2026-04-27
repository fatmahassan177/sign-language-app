import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adddictionary } from './add-dictionary';

describe('AddDictionary', () => {
  let component: Adddictionary;
  let fixture: ComponentFixture<Adddictionary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Adddictionary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adddictionary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
