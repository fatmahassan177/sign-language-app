import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addcourse } from './add-courses';

describe('AddCourses', () => {
  let component: Addcourse;
  let fixture: ComponentFixture<Addcourse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addcourse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addcourse);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
